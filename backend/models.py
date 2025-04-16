from pydantic import BaseModel
from sqlalchemy import Column, Integer, String, Text, Float, ForeignKey, Table, DateTime
from sqlalchemy.orm import relationship, declarative_base
from datetime import datetime

Base = declarative_base()

class Info(BaseModel):
    name : str
    Ingredients: list[str]
    Nutritional: list[str]
    Additives: list[str]

class Title(BaseModel):
    name : str

class Details(BaseModel):
    name : str
    Ingredients: list[str]
    Nutritional: list[str]
    Additives: list[str]
    Allergies: list[str]
    Diseases: list[str]

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True)
    hashed_password = Column(String(255))
    full_name = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow)
    allergies = Column(Text, nullable=True)
    health_conditions = Column(Text, nullable=True)
    favorites = relationship("Product", secondary="user_favorites")

class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True)
    ean = Column(String(13), unique=True, index=True)
    ingredients = Column(Text)
    nutritional_info = Column(Text)
    about = Column(Text)
    brand = Column(String(255))
    category = Column(String(255))
    image_url = Column(String(512), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Analysis(Base):
    __tablename__ = "analyses"
    
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    reality_check = Column(Text)
    consumption_advice = Column(Text)
    health_implications = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    product = relationship("Product", backref="analyses")

# Association table for user favorites
user_favorites = Table(
    "user_favorites",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id")),
    Column("product_id", Integer, ForeignKey("products.id"))
)
