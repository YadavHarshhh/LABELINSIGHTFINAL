import pandas as pd
from sqlalchemy.orm import Session
from database import engine, SessionLocal
from models import Product, Base
import json
import ast
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def import_data():
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    # Read the CSV file from the scraping directory
    df = pd.read_csv('../scraping_bigbasket/clean_data.csv')
    logger.info(f"Loaded {len(df)} products from CSV")
    
    # Process each row
    for index, row in df.iterrows():
        # Create a new session for each product
        db = SessionLocal()
        try:
            # Check if product already exists
            existing_product = db.query(Product).filter(Product.ean == row['EAN']).first()
            
            # Parse nutritional info if it's a string
            nutritional_info = row['Nutritional']
            if isinstance(nutritional_info, str):
                try:
                    # Try to parse as JSON
                    nutritional_info = json.loads(nutritional_info)
                except json.JSONDecodeError:
                    try:
                        # Try to parse as Python literal
                        nutritional_info = ast.literal_eval(nutritional_info)
                    except:
                        logger.warning(f"Could not parse nutritional info for {row['product_name']}, using empty dict")
                        nutritional_info = {}
            
            if existing_product:
                # Update existing product
                existing_product.name = row['product_name']
                existing_product.ingredients = row['Ingredients']
                existing_product.nutritional_info = json.dumps(nutritional_info)
                existing_product.about = row['About']
                existing_product.category = 'Snacks & Branded Foods'
                logger.info(f"Updated product {row['product_name']} (EAN: {row['EAN']})")
            else:
                # Create new product
                product = Product(
                    name=row['product_name'],
                    ean=row['EAN'],
                    ingredients=row['Ingredients'],
                    nutritional_info=json.dumps(nutritional_info),
                    about=row['About'],
                    category='Snacks & Branded Foods'  # Default category from BigBasket scraping
                )
                db.add(product)
                logger.info(f"Added new product {row['product_name']} (EAN: {row['EAN']})")
            
            # Commit changes for this product
            db.commit()
            
            if index % 100 == 0:  # Log progress every 100 products
                logger.info(f"Processed {index} products")
                
        except Exception as e:
            logger.error(f"Error processing product {row['product_name']} (EAN: {row['EAN']}): {str(e)}")
            db.rollback()
        finally:
            db.close()
    
    logger.info("Import completed successfully")

if __name__ == "__main__":
    import_data() 