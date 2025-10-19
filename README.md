# 🪑 Furniture AI: Full-Stack Recommendation & Analytics Engine

This repository contains the source code for a **full-stack web application** that provides **AI-powered furniture recommendations**, **data-driven analytics**, and **generative content creation**.  
It integrates **FastAPI**, **React**, and **state-of-the-art AI tools** to deliver an intelligent, conversational, and interactive user experience.

---

## ✨ Features

- 💬 **Conversational Product Recommendation**  
  A friendly chat interface where users can describe the furniture they're looking for (e.g., *“a modern wooden desk”*) and receive relevant product recommendations powered by AI and vector search.

- 📊 **Data Analytics Dashboard**  
  Interactive visualizations showing insights like top brands, price distributions, and popular furniture categories.

- 🧠 **Generative AI Descriptions**  
  Uses a Large Language Model (LLM) to generate creative and engaging product descriptions from simple inputs like title and brand.

---

## 🛠️ Tech Stack

| Layer | Technology |
|--------|-------------|
| **Frontend** | React + Vite + Tailwind CSS |
| **Backend** | FastAPI (Python) |
| **Database** | Pinecone (Vector Database) |
| **AI Models** | OpenAI API (LLMs for text generation + embeddings) |
| **Environment** | Node.js, Python, Yarn |

---

## 🚀 Setup & Installation

Follow the steps below to get the project running locally.

### 🔧 Prerequisites

Make sure you have the following installed:

- Python **3.8+**
- Node.js **18+**
- Yarn
- [Pinecone Account](https://www.pinecone.io/) + API Key
- [OpenAI Account](https://platform.openai.com/) + API Key

---

### 🧩 Backend Setup

The backend handles AI logic, embedding creation, and product data analytics.

```bash
# 1. Navigate to the backend directory
cd backend/

# 2. Create and configure environment variables
# Create a file named `.env` and add the following lines:
PINECONE_API_KEY="YOUR_PINECONE_API_KEY"
OPENAI_API_KEY="YOUR_OPENAI_API_KEY"

# 3. Install Python dependencies
pip install -r requirements.txt

# 4. Populate the Vector Database (one-time setup)
# This creates the 'ikarus-products' index in Pinecone and uploads product data.
python create_embeddings.py

# 5. Run the FastAPI server
uvicorn main:app --reload
