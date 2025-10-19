Furniture AI: Full-Stack Recommendation & Analytics Engine

This repository contains the source code for a comprehensive, full-stack web application designed to provide AI-powered furniture recommendations, data-driven analytics, and generative content creation. The project leverages a modern tech stack, including FastAPI for the backend, React for the frontend, and a suite of AI tools for its core intelligence.

<!-- Placeholder image -->

Features

Conversational Product Recommendation: A user-friendly chat interface where users can describe the furniture they're looking for in natural language and receive relevant product recommendations.

Data Analytics Dashboard: An interactive dashboard that visualizes key metrics and trends from the product dataset, including top brands, price distribution, and popular categories.

Generative AI Descriptions: A feature that uses a large language model (LLM) to generate new, creative, and engaging product descriptions based on a title and brand.

Tech Stack

Backend: Python, FastAPI

Frontend: JavaScript, React, Vite, Tailwind CSS

Vector Database: Pinecone

AI / ML:

Embeddings: Sentence-Transformers (from Hugging Face)

Generative AI: OpenAI (via API)

Integration: LangChain & LangChain Expression Language (LCEL)

Data Processing: Pandas

Project Structure

.
├── backend/                  # Contains all Python backend code
│   ├── .env                  # Environment variables (API keys)
│   ├── main.py               # Main FastAPI application
│   ├── create_embeddings.py  # Script to populate the vector DB
│   ├── requirements.txt      # Python dependencies
│   └── cleaned_product_data.csv # The dataset
│
└── frontend/                 # Contains all React frontend code
    ├── src/
    │   └── App.jsx           # Main React component with all UI logic
    ├── package.json          # Frontend dependencies
    └── ...


Setup and Installation

Follow these instructions to get the project running locally on your machine.

Prerequisites

Python 3.8+

Node.js 18+ and Yarn

A Pinecone account and API key

An OpenAI account and API key

1. Backend Setup

First, set up the Python server which powers all the AI and data logic.

# 1. Navigate to the backend directory
cd backend/

# 2. Create and configure your environment variables
# Create a file named .env and add your API keys to it:
# PINECONE_API_KEY="YOUR_PINECONE_API_KEY"
# OPENAI_API_KEY="YOUR_OPENAI_API_KEY"

# 3. Install Python dependencies
pip install -r requirements.txt

# 4. Populate the Vector Database (one-time setup)
# This script creates the 'ikarus-products' index in Pinecone and fills it with your product data.
# This will take a few minutes.
python create_embeddings.py

# 5. Run the FastAPI server
uvicorn main:app --reload


The backend server will now be running at http://127.0.0.1:8000.

2. Frontend Setup

In a new, separate terminal, set up the React user interface.

# 1. Navigate to the frontend directory
cd frontend/

# 2. Install frontend dependencies using Yarn
yarn install

# 3. Run the React development server
yarn dev


The frontend application will now be running at http://localhost:5173.

Usage

Once both servers are running, open your web browser and navigate to http://localhost:5173.

Chat: Use the chat interface to type queries like "a comfortable armchair" or "a modern wooden desk" to get product recommendations.

Analytics: Click the "Analytics" button in the header to view the data dashboard.

Generator: Click the "Generator" button, enter a product title and brand, and click "Generate Description" to get an AI-written description.

Important Note on Generative AI

The description generator feature relies on the OpenAI API. The free trial credits for new accounts may expire. To ensure this feature works, you must have an active billing plan and a positive credit balance on your OpenAI account. The application is designed to handle API quota errors gracefully.
