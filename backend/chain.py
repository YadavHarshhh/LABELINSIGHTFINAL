import os
from langchain_groq import ChatGroq
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains import create_retrieval_chain
from vector_store import vectors, llm
from dotenv import load_dotenv
import os
load_dotenv()

groq_api_key=os.getenv('GROQ_API_KEY')
os.environ["GOOGLE_API_KEY"]=os.getenv("GOOGLE_API_KEY")
os.environ["LANGCHAIN_API_KEY"] = os.getenv('LANGCHAIN_API_KEY')
os.environ["LANGCHAIN_TRACING_V2"] = "true"

llm=ChatGroq(groq_api_key=groq_api_key,
             model_name="Llama3-8b-8192")

def reality_query(title,ingredients,nutritional,additives):

    prompt=ChatPromptTemplate.from_template(
    """
    You are an AI assistant tasked with analyzing product information from various sources. Given the following data:
    Additional Context:
    <context>
    {context}
    <context>

    Task:{input}
    """
    )


    document_chain=create_stuff_documents_chain(llm,prompt)
    retriever=vectors.as_retriever()
    retrieval_chain=create_retrieval_chain(retriever,document_chain)

    response=retrieval_chain.invoke({
    'input':"""
    Product Name:{title}
    Nutrients:{nutritional}
    Ingredients:{ingredients}
    Additives:{additives}
   Provide a detailed analysis of the product's reality, covering aspects such as:
    - Nutritional value
    - Potential health benefits or concerns
    - Ingredient quality and sourcing
    - Presence of any harmful additives or preservatives
    - Overall assessment based on the provided information

    """.format(title=title, nutritional=nutritional, ingredients=ingredients, additives=additives)
    })
    
    global product_reality
    product_reality = response['answer']
    print(product_reality)


def compare(title,reality):
    prompt = ChatPromptTemplate.from_messages([("human","{text}")])
    
    chain = prompt | llm
    response = chain.invoke({"text":
        """
        As a skilled analyst, you have been given the following information:

        Product Name: {title}
        Product Reality: {product_reality}

        find what the product({title}) claims and then
        Task:
        Compare the product's reality with the claims made by the manufacturer/brand.
        Identify any discrepancies, misleading statements, or areas where the claims
        do not align with the actual product information. Provide an objective assessment
        of the validity of the claims based on the available data.

        Remember, your analysis can reveal the truth behind the product and help consumers make informed decisions.

        """.format(title=title,product_reality=reality) })
    
    global product_comparison
    product_comparison = response['answer']
    print(product_comparison)
    


def consumption(title,ingredients,nutritional,additives,allergies,diseases):
    
    prompt = {
        "assessment":"{assessment}",
        "consumption":"{consumption}"     
        }

    document_chain=create_stuff_documents_chain(llm,prompt)
    retriever=vectors.as_retriever()
    retrieval_chain=create_retrieval_chain(retriever,document_chain)

    response=retrieval_chain.invoke({

        "assessment":"""
            You are a health and nutrition expert analyzing the following product information:

            Product Name: {title}
            Nutrients: {nutritional}
            Ingredients: {ingredients}
            Additives: {additives}
            User Allergies: {allergies}
            User Diseases/Conditions: {diseases}

            Based on the provided data, assess the potential harmful effects or 
            allergic reactions the product may have on the user, considering their 
            specific allergies and health conditions.
        """.format(title=title, nutritional=nutritional, ingredients=ingredients, additives=additives,allergies=allergies,diseases=diseases),

        "consumption":"""
            You are a health and nutrition expert analyzing the following product information:

            Product Name: {title}
            Nutrients: {nutritional}
            Ingredients: {ingredients}
            Additives: {additives}
            User Allergies: {allergies}
            User Diseases/Conditions: {diseases}

            Provide guidance on the recommended daily or monthly consumption limits for this product, 
            taking into account its nutritional profile and the user's health status.
        """.format(title=title, nutritional=nutritional, ingredients=ingredients, additives=additives,allergies=allergies,diseases=diseases)
    })
    
    global product_consumption
    global product_assessment
    product_consumption = response['consumption']
    product_assessment = response['assessment']
    print(product_consumption)
    print(product_assessment)
