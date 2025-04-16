from langchain_groq import ChatGroq
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains import create_retrieval_chain
from dotenv import load_dotenv
import os

load_dotenv()

# Initialize LLM without API key for now
llm = None

# Initialize vector store
def create_vectorDB(directory):
    return None

vectors = create_vectorDB("./data") 