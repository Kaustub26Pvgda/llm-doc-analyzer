# LLM Document Analyzer

A full-stack document analysis application powered by FastAPI, React, and Gemini LLM. Upload PDF documents, extract and analyze their contents, and view document history and details with confidence metrics.

---

## Features
- **PDF Upload:** Drag & drop or browse to upload PDF documents.
- **Text Extraction:** Extracts text from uploaded PDFs using `pypdf`.
- **Document Analysis:** Uses Gemini LLM to classify document type (contract, invoice, report), detect missing fields, and provide recommendations.
- **Confidence Metric:** Shows confidence in detected document type (backend default: 95%).
- **History & Details:** View all uploaded documents, search by name, and see details for each document.
- **Pagination:** History page paginates results for easy browsing.
- **Modern UI:** Responsive React frontend with modular components and CSS modules.
- **Backend Database:** Stores documents and analysis results in SQLite using SQLAlchemy ORM.

---

## Tech Stack
- **Backend:** FastAPI, SQLAlchemy, SQLite, pypdf, python-dotenv, google-generativeai
- **Frontend:** React (Vite + TypeScript), CSS Modules, react-router-dom
- **LLM:** Gemini 1.5 Flash (Google Generative AI)

---

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/Kaustub26Pvgda/llm-doc-analyzer.git
cd llm-doc-analyzer
```

### 2. Backend Setup
- Navigate to the backend folder:
  ```bash
  cd doc-analyzer-backend
  ```
- Create a `.env` file and add your Gemini API key:
  ```
  GEMINI_API_KEY=your_api_key_here
  ```
- Install dependencies:
  ```bash
  pip install -r requirements.txt
  ```
- Run the backend server:
  ```bash
  uvicorn run:app --reload
  ```
- The backend runs on `http://localhost:8000` by default.

### 3. Frontend Setup
- Navigate to the frontend folder:
  ```bash
  cd ../doc-analyzer-frontend
  ```
- Install dependencies:
  ```bash
  npm install
  ```
- Start the frontend dev server:
  ```bash
  npm run dev
  ```
- The frontend runs on `http://localhost:5173` (or next available port).

---

## Usage
1. **Upload a PDF:** Use the upload page to drag & drop or browse for a PDF.
2. **Analyze:** After upload, click "Analyze" to classify and check for missing fields.
3. **View History:** See all uploaded documents, search by name, and paginate through results.
4. **Document Details:** Click any document in history to view extracted text, detected type, missing fields, and recommendations.

---

## Points & Notes
- **Confidence Metric:** The backend returns a confidence value for document type detection. If the LLM does not provide one, a default of 95% is used.
- **Missing Fields:** If all required fields are present, a green message is shown in the details page.
- **.env & Sensitive Files:** `.env`, `__pycache__`, and `.db` files are excluded from git via `.gitignore`.
- **Database:** Uses SQLite for simplicity. You can view the database using DB Browser for SQLite or VS Code extensions.
- **LLM Prompt:** The Gemini prompt is designed to request document type, missing fields, recommendations, and confidence.
- **Frontend Routing:** Uses react-router-dom for navigation between upload, history, and document detail pages.
- **Assets:** Home icon is stored in `assets/home.png` for the navbar.

---

## Troubleshooting
- **Backend not running?** Check your `.env` and API key, and ensure all dependencies are installed.
- **Frontend blank?** Make sure the backend is running and CORS is enabled in FastAPI.
- **Database issues?** Delete the `.db` file and restart the backend to recreate tables.
- **LLM errors?** Ensure your Gemini API key is valid and has sufficient quota.

---

## License
MIT

---

## Author
Kaustub Pavagada
