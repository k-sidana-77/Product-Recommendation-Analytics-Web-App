
import os
import pandas as pd
from pinecone import Pinecone, ServerlessSpec
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv
from tqdm.auto import tqdm

# --- Configuration ---
load_dotenv()
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_ENVIRONMENT = os.getenv("PINECONE_ENVIRONMENT", "us-east-1") 

if not PINECONE_API_KEY:
    raise ValueError("PINECONE_API_KEY is not set in the environment variables.")

# --- CORRECTED INDEX NAME ---
INDEX_NAME = "ikarus-products" 
MODEL_NAME = 'sentence-transformers/all-MiniLM-L6-v2'
DATA_FILE = "cleaned_product_data.csv"

# --- Main Script ---
def main():
    print("Initializing Pinecone and Sentence Transformer model...")
    pc = Pinecone(api_key=PINECONE_API_KEY)
    model = SentenceTransformer(MODEL_NAME)
    
    if INDEX_NAME not in pc.list_indexes().names():
        print(f"Index '{INDEX_NAME}' does not exist. Creating a new one...")
        pc.create_index(
            name=INDEX_NAME,
            dimension=model.get_sentence_embedding_dimension(),
            metric='cosine',
            spec=ServerlessSpec(cloud='aws', region=PINECONE_ENVIRONMENT)
        )
        print("Index created successfully.")
    else:
        print(f"Index '{INDEX_NAME}' already exists. Connecting to it.")

    pinecone_index = pc.Index(INDEX_NAME)

    print(f"Loading data from '{DATA_FILE}'...")
    df = pd.read_csv(DATA_FILE)
    df = df.dropna(subset=['description', 'uniq_id']).copy()
    df['uniq_id'] = df['uniq_id'].astype(str)
    print(f"Data loaded. Found {len(df)} products.")

    batch_size = 100
    print(f"Creating embeddings and uploading to Pinecone in batches of {batch_size}...")
    
    for i in tqdm(range(0, len(df), batch_size)):
        i_end = min(i + batch_size, len(df))
        batch = df.iloc[i:i_end]
        embeddings = model.encode(batch['description'].tolist(), show_progress_bar=False).tolist()
        metadata = batch.to_dict(orient='records')
        for record in metadata:
            for key, value in record.items():
                record[key] = "" if pd.isna(value) else str(value)
        vectors_to_upsert = list(zip(batch['uniq_id'], embeddings, metadata))
        pinecone_index.upsert(vectors=vectors_to_upsert)

    print("\nData upload to Pinecone is complete.")
    print("You can now start your FastAPI server.")

if __name__ == "__main__":
    main()



