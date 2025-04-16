
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import PyPDFDirectoryLoader
from langchain_google_genai import GoogleGenerativeAIEmbeddings
import requests
from bs4 import BeautifulSoup
from link import links


def create_vectorDB(directory):
    embeddings=GoogleGenerativeAIEmbeddings(model = "models/embedding-004")
    loader=PyPDFDirectoryLoader(directory) ## Data Ingestion
    docs=loader.load() ## Document Loading
    text_splitter=RecursiveCharacterTextSplitter(chunk_size=1000,chunk_overlap=200) ## Chunk Creation

    for link in links:
        html_doc = requests.get(link)
        soup = BeautifulSoup(html_doc.text, 'html.parser')
        docs.append(soup.get_text())

    final_documents=text_splitter.split_documents(docs[:20]) #splitting
    vectors=FAISS.from_documents(final_documents,embeddings) #vector embeddings
    return vectors