
import os
from dotenv import load_dotenv
from pydantic import BaseModel
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

import google.generativeai as genai
from fastapi import APIRouter, UploadFile, File, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from pypdf import PdfReader
import io
import json
from models import Document, AnalysisResult
from dependencies import get_db
from typing import List

router = APIRouter()

# Get all documents
@router.get("/documents")
def get_documents(db: Session = Depends(get_db)):
    docs = db.query(Document).all()
    return [
        {
            "id": doc.id,
            "filename": doc.filename,
            "created_at": doc.created_at.isoformat() if doc.created_at else None,
            "content": doc.content
        }
        for doc in docs
    ]

# Get a single document by ID
@router.get("/documents/{document_id}")
def get_document(document_id: int, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        return JSONResponse(status_code=404, content={"error": "Document not found."})
    return {
        "id": doc.id,
        "filename": doc.filename,
        "created_at": doc.created_at.isoformat() if doc.created_at else None,
        "content": doc.content
    }

# Get all analysis results
@router.get("/analysis")
def get_all_analysis(db: Session = Depends(get_db)):
    results = db.query(AnalysisResult).all()
    return [
        {
            "id": res.id,
            "document_id": res.document_id,
            "document_type": res.document_type,
            "missing_fields": json.loads(res.missing_fields),
            "recommendations": res.recommendations,
            "created_at": res.created_at.isoformat() if res.created_at else None,
            "confidence": 0.95  # Default for all results
        }
        for res in results
    ]

# Get analysis result by ID
@router.get("/analysis/{analysis_id}")
def get_analysis(analysis_id: int, db: Session = Depends(get_db)):
    res = db.query(AnalysisResult).filter(AnalysisResult.id == analysis_id).first()
    if not res:
        return JSONResponse(status_code=404, content={"error": "Analysis result not found."})
    return {
        "id": res.id,
        "document_id": res.document_id,
        "document_type": res.document_type,
        "missing_fields": json.loads(res.missing_fields),
        "recommendations": res.recommendations,
        "created_at": res.created_at.isoformat() if res.created_at else None,
        "confidence": 0.95  # Default for single result
    }


@router.get("/")
def health_check():
    return {"status": "ok"}

@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if file.content_type != "application/pdf":
        return JSONResponse(status_code=400, content={"error": "File must be a PDF"})
    contents = await file.read()
    try:
        reader = PdfReader(io.BytesIO(contents))
        text = "\n".join(page.extract_text() or "" for page in reader.pages)
        # Save to DB
        doc = Document(filename=file.filename, content=text)
        db.add(doc)
        db.commit()
        db.refresh(doc)
        return {"id": doc.id, "filename": doc.filename, "text": text}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


# Pydantic model for /analyze request

# Pydantic model for /analyze request

# Pydantic model for /analyze request
class AnalyzeRequest(BaseModel):
    document_id: int


@router.post("/analyze")
async def analyze_document(body: AnalyzeRequest, db: Session = Depends(get_db)):
    document_id = body.document_id
    if not document_id:
        return JSONResponse(status_code=400, content={"error": "Missing 'document_id' field in request body."})
    # Fetch document from DB
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        return JSONResponse(status_code=404, content={"error": "Document not found."})
    content = doc.content
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel("gemini-1.5-flash")
        prompt = f"""
        You are a document analysis assistant. Analyze the following text and:
        1. Classify the document as one of: contract, invoice, or report.
        2. Check for missing required fields:
           - For contracts: party_1, party_2, signature, date, payment_terms
           - For invoices: invoice_number, amount, due_date, tax, bill_to, bill_from
          3. Return a JSON object with keys:
              - document_type (string)
              - missing_fields (list of strings)
              - recommendations (string, optional)
              - confidence (float, between 0 and 1, representing confidence in the detected type)
        Only output valid JSON.
        Document text:
        '''
        {content}
        '''
        """
        response = model.generate_content(prompt)
        raw_text = response.text.strip()
        # Remove Markdown code fences if present
        if raw_text.startswith('```'):
            lines = raw_text.splitlines()
            json_str = '\n'.join(line for line in lines if not line.strip().startswith('```'))
        else:
            json_str = raw_text
        try:
            result = json.loads(json_str)
        except Exception:
            return JSONResponse(status_code=500, content={"error": "Gemini response not valid JSON", "raw": response.text})
        # Save analysis result
        analysis = AnalysisResult(
            document_id=document_id,
            document_type=result.get("document_type"),
            missing_fields=json.dumps(result.get("missing_fields", [])),
            recommendations=result.get("recommendations")
        )
        db.add(analysis)
        db.commit()
        db.refresh(analysis)
        return {
            "document_id": document_id,
            "analysis_id": analysis.id,
            "document_type": analysis.document_type,
            "missing_fields": json.loads(analysis.missing_fields),
            "recommendations": analysis.recommendations,
            "confidence": result.get("confidence", 0.95)
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
