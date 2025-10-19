
# import os
# import pandas as pd
# from fastapi import FastAPI, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# from sentence_transformers import SentenceTransformer
# from pinecone import Pinecone
# from dotenv import load_dotenv

# # --- Configuration ---
# load_dotenv()
# PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")

# if not PINECONE_API_KEY:
#     raise ValueError("PINECONE_API_KEY is not set in the environment variables.")

# # --- CORRECTED INDEX NAME ---
# INDEX_NAME = "ikarus-products"
# MODEL_NAME = 'sentence-transformers/all-MiniLM-L6-v2'
# DATA_FILE = "cleaned_product_data.csv"

# # --- Initialize Models and Database ---
# try:
#     model = SentenceTransformer(MODEL_NAME)
#     pinecone = Pinecone(api_key=PINECONE_API_KEY)
    
#     if INDEX_NAME not in pinecone.list_indexes().names():
#         print(f"Warning: Index '{INDEX_NAME}' does not exist in Pinecone. Recommendation endpoint will fail.")
#         pinecone_index = None
#     else:
#         pinecone_index = pinecone.Index(INDEX_NAME)

# except Exception as e:
#     print(f"Error during initialization: {e}")
#     pinecone_index = None 
#     model = None

# # --- FastAPI App ---
# app = FastAPI(
#     title="Product Recommendation & Analytics API",
#     description="API for furniture products.",
#     version="1.1.0"
# )

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"],
# )

# class Query(BaseModel):
#     text: str
#     top_k: int = 5

# @app.get("/")
# def read_root():
#     return {"status": "ok", "message": "Welcome to the Product API!"}

# @app.post("/recommend")
# def recommend_products(query: Query):
#     if not model or not pinecone_index:
#         raise HTTPException(status_code=503, detail="Recommendation engine is not initialized.")
#     try:
#         query_embedding = model.encode(query.text).tolist()
#         results = pinecone_index.query(
#             vector=query_embedding, top_k=query.top_k, include_metadata=True
#         )
#         recommendations = []
#         for match in results['matches']:
#             metadata = match['metadata']
#             # Data cleaning for images field
#             if 'images' in metadata and (not metadata['images'] or metadata['images'] == 'nan'):
#                 metadata['images'] = ''
#             recommendations.append(metadata)
#         return {"recommendations": recommendations}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Failed to retrieve recommendations: {str(e)}")

# @app.get("/analytics")
# def get_analytics():
#     try:
#         df = pd.read_csv(DATA_FILE)
#         df['price'] = pd.to_numeric(df['price'], errors='coerce')
#         df.dropna(subset=['price'], inplace=True)
#         total_products, average_price, unique_brands = int(len(df)), round(df['price'].mean(), 2), int(df['brand'].nunique())
#         brand_counts = df['brand'].value_counts().nlargest(10)
#         price_bins = pd.cut(df['price'], bins=[0, 50, 100, 200, 500, 1000, 10000], labels=['0-50', '50-100', '100-200', '200-500', '500-1k', '1k+'])
#         price_distribution = price_bins.value_counts().sort_index()
#         category_counts = df['primary_category'].value_counts().nlargest(10)
#         return {
#             "keyMetrics": {"totalProducts": total_products, "averagePrice": average_price, "uniqueBrands": unique_brands},
#             "topBrands": [{"name": index, "count": value} for index, value in brand_counts.items()],
#             "priceDistribution": [{"range": index, "count": value} for index, value in price_distribution.items()],
#             "topCategories": [{"name": index, "count": value} for index, value in category_counts.items()]
#         }
#     except FileNotFoundError:
#         raise HTTPException(status_code=404, detail=f"Data file '{DATA_FILE}' not found.")
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Failed to generate analytics: {str(e)}")

import os
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from pinecone import Pinecone
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

# --- Configuration ---
load_dotenv()
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not PINECONE_API_KEY or not OPENAI_API_KEY:
    raise ValueError("PINECONE_API_KEY and OPENAI_API_KEY must be set in the environment variables.")

INDEX_NAME = "ikarus-products"
MODEL_NAME = 'sentence-transformers/all-MiniLM-L6-v2'
DATA_FILE = "cleaned_product_data.csv"

# --- Initialize Models, Database, and LangChain ---
try:
    model = SentenceTransformer(MODEL_NAME)
    pinecone = Pinecone(api_key=PINECONE_API_KEY)
    
    if INDEX_NAME not in pinecone.list_indexes().names():
        pinecone_index = None
        print(f"Warning: Index '{INDEX_NAME}' does not exist. Recommendation endpoint will fail.")
    else:
        pinecone_index = pinecone.Index(INDEX_NAME)

    # --- MODERN LANGCHAIN SETUP (LCEL) ---
    llm = ChatOpenAI(openai_api_key=OPENAI_API_KEY, model_name="gpt-3.5-turbo", temperature=0.7)
    prompt = ChatPromptTemplate.from_template(
        "Generate a creative, engaging, and brief (2-3 sentences) product description for a furniture item. Title: {title}, Brand: {brand}."
    )
    output_parser = StrOutputParser()
    description_chain = prompt | llm | output_parser

except Exception as e:
    print(f"Error during initialization: {e}")
    pinecone_index, model, description_chain = None, None, None

# --- FastAPI App ---
app = FastAPI(title="Product Recommendation & Analytics API")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

class Query(BaseModel):
    text: str
    top_k: int = 5

class ProductInfo(BaseModel):
    title: str
    brand: str

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Welcome to the Product Recommendation API!"}

@app.post("/recommend")
def recommend_products(query: Query):
    if not model or not pinecone_index:
        raise HTTPException(status_code=503, detail="Recommendation engine is not initialized.")
    try:
        query_embedding = model.encode(query.text).tolist()
        results = pinecone_index.query(
            vector=query_embedding, top_k=query.top_k, include_metadata=True
        )
        recommendations = []
        for match in results['matches']:
            metadata = match['metadata']
            # Data cleaning for images
            if 'images' in metadata and (not metadata['images'] or metadata['images'] == 'nan'):
                metadata['images'] = ''
            recommendations.append(metadata)
        return {"recommendations": recommendations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve recommendations: {str(e)}")


@app.post("/generate_description")
def generate_description(product_info: ProductInfo):
    if not description_chain:
        raise HTTPException(status_code=503, detail="Generative AI service is not initialized.")
    try:
        # --- Use .invoke() with a dictionary payload ---
        response = description_chain.invoke({"title": product_info.title, "brand": product_info.brand})
        return {"description": response.strip()}
    except Exception as e:
        print(f"Error from LangChain/OpenAI: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate description: {str(e)}")

@app.get("/analytics")
def get_analytics():
    try:
        df = pd.read_csv(DATA_FILE)
        df['price'] = pd.to_numeric(df['price'], errors='coerce')
        df.dropna(subset=['price'], inplace=True)
        
        total_products = int(len(df))
        average_price = round(df['price'].mean(), 2)
        unique_brands = int(df['brand'].nunique())
        
        brand_counts = df['brand'].value_counts().nlargest(10)
        
        price_bins = pd.cut(df['price'], bins=[0, 50, 100, 200, 500, 1000, 10000], labels=['0-50', '50-100', '100-200', '200-500', '500-1k', '1k+'])
        price_distribution = price_bins.value_counts().sort_index()
        
        category_counts = df['primary_category'].value_counts().nlargest(10)

        return {
            "keyMetrics": {
                "totalProducts": total_products,
                "averagePrice": average_price,
                "uniqueBrands": unique_brands
            },
            "topBrands": [{"name": index, "count": value} for index, value in brand_counts.items()],
            "priceDistribution": [{"range": index, "count": value} for index, value in price_distribution.items()],
            "topCategories": [{"name": index, "count": value} for index, value in category_counts.items()]
        }
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=f"Data file '{DATA_FILE}' not found.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate analytics: {str(e)}")

