# 🪑 Furniture AI: Full-Stack Recommendation & Analytics Engine

This repository contains the source code for a **comprehensive, full-stack web application** designed to provide **AI-powered furniture recommendations**, **data-driven analytics**, and **generative content creation**.

The project leverages a **modern tech stack** — including **FastAPI** for the backend, **React + Vite** for the frontend, and a suite of **AI tools** (OpenAI, Pinecone) for its core intelligence.

---

## ✨ Features

- 💬 **Conversational Product Recommendation**  
  A user-friendly chat interface where users can describe the furniture they're looking for in natural language and receive relevant product recommendations.

- 📊 **Data Analytics Dashboard**  
  An interactive dashboard that visualizes key metrics and trends from the product dataset, including top brands, price distribution, and popular categories.

- 🧠 **Generative AI Descriptions**  
  A feature that uses a large language model (LLM) to generate new, creative, and engaging product descriptions based on a title and brand.

---

## 🛠️ Tech Stack

**Frontend:** React (Vite, Tailwind CSS)  
**Backend:** FastAPI, Uvicorn  
**Database:** Pinecone Vector Database  
**AI Tools:** OpenAI GPT API  
**Language:** Python, JavaScript  
**Package Managers:** pip, Yarn

---

## 🚀 Setup and Installation

Follow these instructions to get the project running locally on your machine.

### 🧩 Prerequisites

- Python 3.8+  
- Node.js 18+ and Yarn  
- A [Pinecone](https://www.pinecone.io) account and API key  
- An [OpenAI](https://platform.openai.com) account and API key  

---

## 🧠 Backend Setup (FastAPI)

First, set up the Python backend that powers all the AI and data logic.

```bash
# 1. Navigate to the backend directory
cd backend/

# 2. Create a .env file with your API keys
# Example:
# PINECONE_API_KEY="YOUR_PINECONE_API_KEY"
# OPENAI_API_KEY="YOUR_OPENAI_API_KEY"

# 3. Install dependencies
pip install -r requirements.txt

# 4. Populate the Vector Database (one-time setup)
python create_embeddings.py

# 5. Run the FastAPI server
uvicorn main:app --reload
```

Your backend server will be running at:
➡️ **http://127.0.0.1:8000**

---

## 💻 Frontend Setup (React + Vite)

In a new terminal, set up and run the frontend.

```bash
# 1. Navigate to the frontend directory
cd frontend/

# 2. Install dependencies
yarn install

# 3. Run the development server
yarn dev
```

Your frontend will be available at:
➡️ **http://localhost:5173**

---

## 🖥️ Usage

Once both servers are running, open your browser and go to **http://localhost:5173**.

**💬 Chat:**
Type queries like "a comfortable armchair" or "a modern wooden desk" to receive product recommendations.

**📈 Analytics:**
Click the Analytics button in the header to view product data dashboards and trends.

**✍️ Generator:**
Click the Generator button, enter a product title and brand, and click Generate Description to get an AI-written product description.

---

## ⚠️ Important Note on Generative AI

The description generator feature relies on the OpenAI API.
If you are using a free OpenAI account, your trial credits may expire.

To ensure this feature continues to work:

- Set up billing on your OpenAI account.
- Ensure you have a positive credit balance.
- The app is designed to handle API quota errors gracefully.

---

## 📁 Project Structure

```
FURNITURE_AI_PROJECT/
│
├── backend/
│   ├── main.py
│   ├── create_embeddings.py
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── data/
│   ├── cleaned_product_data.csv
│   ├── intern_data_ikarus.csv
│   └── Data Analysis and Preparation.py
│
└── README.md
```

---

## 🤝 Contributing

Contributions are welcome!
Feel free to fork this repository, make your changes, and open a pull request.

---

## 📜 License

This project is licensed under the MIT License — see the LICENSE file for details.

---

## 🌟 Acknowledgments

- [FastAPI](https://fastapi.tiangolo.com/)
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [OpenAI](https://openai.com/)
- [Pinecone](https://www.pinecone.io/)
