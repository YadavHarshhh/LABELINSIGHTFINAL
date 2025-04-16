from fastapi import FastAPI, Depends, HTTPException, status, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta, datetime
import os
from dotenv import load_dotenv
from typing import List, Optional, Dict
import json
from pydantic import BaseModel

from database import get_db, engine
import models, auth
from models import Base
from chain import reality_query, compare, consumption
from vector_store import analyze_product, compare_products
import openfoodfacts

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize vector store
@app.on_event("startup")
async def startup_event():
    print("Gemini AI is ready")

# Auth endpoints
@app.post("/token")
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/users/")
async def create_user(
    email: str = Body(...),
    password: str = Body(...),
    full_name: str = Body(...),
    db: Session = Depends(get_db)
):
    db_user = db.query(models.User).filter(models.User.email == email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = auth.get_password_hash(password)
    db_user = models.User(
        email=email,
        hashed_password=hashed_password,
        full_name=full_name
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {"email": db_user.email, "full_name": db_user.full_name}

# Product endpoints
@app.get("/products/")
async def get_products(
    skip: int = 0,
    limit: int = 10,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Product).filter(models.Product.ean.isnot(None)).filter(models.Product.ean != '')
    if search:
        query = query.filter(models.Product.name.ilike(f"%{search}%"))
    return query.offset(skip).limit(limit).all()

@app.get("/products/{ean}")
async def get_product(
    ean: str,
    db: Session = Depends(get_db)
):
    # First check our database
    product = db.query(models.Product).filter(models.Product.ean == ean).first()
    
    if not product:
        # Try to fetch from Open Food Facts
        off_product = openfoodfacts.products.get_product(ean)
        if off_product and off_product.get('status') == 1:
            product_data = off_product['product']
            # Clean the image URL by trimming whitespace
            image_url = product_data.get('image_url', '').strip() if product_data.get('image_url') else ''
            product = models.Product(
                name=product_data.get('product_name', ''),
                ean=ean,
                ingredients=product_data.get('ingredients_text', ''),
                nutritional_info=json.dumps(product_data.get('nutriments', {})),
                brand=product_data.get('brands', ''),
                category=product_data.get('categories', ''),
                image_url=image_url
            )
            db.add(product)
            db.commit()
            db.refresh(product)
        else:
            raise HTTPException(status_code=404, detail="Product not found")
    
    return product

@app.post("/products/analyze")
async def analyze_product(
    ean: str = Body(...),
    name: str = Body(...),
    db: Session = Depends(get_db)
):
    product = db.query(models.Product).filter(models.Product.ean == ean).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Check if analysis exists and is recent (less than 24 hours old)
    existing_analysis = (
        db.query(models.Analysis)
        .filter(models.Analysis.product_id == product.id)
        .order_by(models.Analysis.created_at.desc())
        .first()
    )
    
    if existing_analysis and (datetime.utcnow() - existing_analysis.created_at).days < 1:
        return existing_analysis
    
    # Perform new analysis
    reality_result = reality_query(
        title=name,  # Use the provided name
        ingredients=product.ingredients,
        nutritional=product.nutritional_info,
        additives=""  # Extract from ingredients if needed
    )
    
    # Since we don't have user preferences, use empty strings for allergies and health conditions
    consumption_result = consumption(
        title=name,
        ingredients=product.ingredients,
        nutritional=product.nutritional_info,
        additives="",
        allergies="",
        diseases=""
    )
    
    analysis = models.Analysis(
        product_id=product.id,
        reality_check=reality_result,
        consumption_advice=consumption_result["consumption"],
        health_implications=consumption_result["assessment"]
    )
    
    db.add(analysis)
    db.commit()
    db.refresh(analysis)
    
    return analysis

# User preference endpoints
@app.put("/users/me/preferences")
async def update_preferences(
    allergies: List[str] = Body(...),
    health_conditions: List[str] = Body(...),
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    current_user.allergies = json.dumps(allergies)
    current_user.health_conditions = json.dumps(health_conditions)
    db.commit()
    return {"message": "Preferences updated successfully"}

@app.post("/users/me/favorites/{ean}")
async def add_to_favorites(
    ean: str,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    product = db.query(models.Product).filter(models.Product.ean == ean).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    current_user.favorites.append(product)
    db.commit()
    return {"message": "Product added to favorites"}

@app.get("/users/me/favorites")
async def get_favorites(
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    return current_user.favorites

class Product(BaseModel):
    name: str
    ingredients: str

class ProductComparison(BaseModel):
    product1: Product
    product2: Product

@app.post("/analyze")
async def analyze_product_endpoint(product: Product):
    try:
        result = analyze_product(product.name, product.ingredients)
        return {"analysis": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/compare")
async def compare_products_endpoint(comparison: ProductComparison):
    try:
        result = compare_products(
            {"name": comparison.product1.name, "ingredients": comparison.product1.ingredients},
            {"name": comparison.product2.name, "ingredients": comparison.product2.ingredients}
        )
        return {"comparison": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


