import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini
genai.configure(api_key="AIzaSyBvOIN7GjMXtDdV08mPZp8Y5D2c6NNNYPI")

# Initialize the model
model = genai.GenerativeModel('gemini-2.0-flash')

# Function to analyze product information
def analyze_product(product_name, ingredients):
    prompt = f"""
    Analyze the following product:
    Name: {product_name}
    Ingredients: {ingredients}
    
    Please provide:
    1. A brief description of the product
    2. Key nutritional highlights
    3. Any potential allergens or concerns
    4. Overall health rating (1-10)
    """
    
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error analyzing product: {str(e)}"

# Function to compare products
def compare_products(product1, product2):
    prompt = f"""
    Compare these two products:
    
    Product 1:
    Name: {product1['name']}
    Ingredients: {product1['ingredients']}
    
    Product 2:
    Name: {product2['name']}
    Ingredients: {product2['ingredients']}
    
    Please provide:
    1. Key differences in ingredients
    2. Which product is healthier and why
    3. Specific recommendations for each product
    """
    
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error comparing products: {str(e)}" 