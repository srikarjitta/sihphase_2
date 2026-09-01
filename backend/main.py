import os
from typing import List, Optional
from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from models.schemas import (
    UserProfileRequest, RecommendationResponse, SchemeModel,
    CalculatorRequest, CalculatorResponse,
    PartnerFilterRequest, PartnerListResponse,
    DocumentChecklistResponse, ApplicationTrackResponse,
    ChatRequest, ChatResponse
)
from services.eligibility_engine import recommend_schemes, load_schemes
from services.calculator_service import calculate_financials
from services.geo_service import find_channel_partners
from services.tracking_service import get_document_checklist, track_application
from services.ai_assistant_service import answer_financial_query

app = FastAPI(
    title="SIH26092 - MoSJE AI Scheme Matching API",
    description="Backend API for Smart Scheme Matching, Financial Calculation, Geo-Spatial Partner Routing, and Multilingual Assistance.",
    version="1.0.0"
)

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist"))
if os.path.exists(frontend_dist):
    assets_dir = os.path.join(frontend_dist, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/favicon.svg", include_in_schema=False)
    def get_favicon():
        fav_path = os.path.join(frontend_dist, "favicon.svg")
        if os.path.exists(fav_path):
            return FileResponse(fav_path)
        raise HTTPException(status_code=404, detail="Favicon not found")

    @app.get("/icons.svg", include_in_schema=False)
    def get_icons():
        icons_path = os.path.join(frontend_dist, "icons.svg")
        if os.path.exists(icons_path):
            return FileResponse(icons_path)
        raise HTTPException(status_code=404, detail="Icons not found")

    @app.get("/app", include_in_schema=False)
    def serve_frontend():
        return FileResponse(os.path.join(frontend_dist, "index.html"))

@app.get("/")
def health_check():
    return {
        "status": "healthy",
        "problem_statement": "SIH26092",
        "project": "AI-Driven Scheme Matching for Marginalized Entrepreneurs",
        "ministry": "Ministry of Social Justice and Empowerment (MoSJE)",
        "version": "1.0.0",
        "web_app_url": "/app",
        "docs_url": "/docs"
    }

@app.get("/api/schemes", response_model=List[SchemeModel])
def get_all_schemes():
    """Retrieve all prototype MoSJE schemes"""
    return load_schemes()

@app.post("/api/eligibility/check", response_model=RecommendationResponse)
def check_eligibility(profile: UserProfileRequest):
    """
    Deterministic rule-based eligibility evaluation and scheme recommendation.
    """
    return recommend_schemes(profile)

@app.post("/api/calculator/calculate", response_model=CalculatorResponse)
def calculate_loan(req: CalculatorRequest):
    """
    Mathematically exact EMI, Moratorium impact, and Amortization schedule calculation.
    """
    return calculate_financials(req)

@app.post("/api/partners/nearby", response_model=PartnerListResponse)
def get_nearby_partners(req: PartnerFilterRequest):
    """
    Geo-spatial channel partner locator with Haversine distance and suitability ranking.
    """
    return find_channel_partners(req)

@app.get("/api/documents/checklist/{scheme_id}", response_model=DocumentChecklistResponse)
def get_checklist(scheme_id: str):
    """
    Get scheme-tailored required document checklist and verification status.
    """
    return get_document_checklist(scheme_id)

@app.get("/api/applications/track/{application_id}", response_model=ApplicationTrackResponse)
def get_application_status(application_id: str):
    """
    5-stage visual application journey tracker.
    """
    return track_application(application_id)

@app.post("/api/chat", response_model=ChatResponse)
def chat_ai_assistant(req: ChatRequest):
    """
    RAG-grounded AI Financial Assistant with safety guardrails.
    """
    return answer_financial_query(req)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
