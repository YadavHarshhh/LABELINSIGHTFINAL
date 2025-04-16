import os
from dotenv import load_dotenv
from vector_store import analyze_product, compare_products

load_dotenv()

def reality_query(title, ingredients, nutritional, additives):
    """Analyze a product's reality check"""
    return analyze_product(title, ingredients)

def compare(product1, product2):
    """Compare two products"""
    return compare_products(
        {"name": product1["name"], "ingredients": product1["ingredients"]},
        {"name": product2["name"], "ingredients": product2["ingredients"]}
    )

def consumption(title, ingredients, nutritional, additives, allergies, diseases):
    """Analyze product consumption advice"""
    analysis = analyze_product(title, ingredients)
    return {
        "consumption": analysis,
        "assessment": "Based on the analysis, please consult with a healthcare professional for personalized advice."
    }
