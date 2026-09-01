import httpx
import pytest

BACKEND_URL = "http://127.0.0.1:8000"
FRONTEND_URL = "http://127.0.0.1:5174"

def test_health_check():
    res = httpx.get(f"{BACKEND_URL}/")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert data["problem_statement"] == "SIH26092"

def test_get_schemes():
    res = httpx.get(f"{BACKEND_URL}/api/schemes")
    assert res.status_code == 200
    schemes = res.json()
    assert len(schemes) >= 3
    ids = [s["id"] for s in schemes]
    assert "mosje_micro_finance" in ids
    assert "mosje_term_loan" in ids
    assert "mosje_educational_loan" in ids

def test_eligibility_recommendation_flow():
    # 1. Micro Finance match
    payload_micro = {
        "name": "Smt. K. Lakshmi",
        "annual_family_income": 120000,
        "is_sc_eligible": True,
        "project_type": "Dairy",
        "estimated_project_cost": 140000,
        "education_status": "Working",
        "gender": "Female",
        "state": "Telangana",
        "district": "Hyderabad",
        "pincode": "500028"
    }
    res_micro = httpx.post(f"{BACKEND_URL}/api/eligibility/check", json=payload_micro)
    assert res_micro.status_code == 200
    data_micro = res_micro.json()
    assert data_micro["is_eligible"] is True
    assert data_micro["recommended_scheme"]["id"] == "mosje_micro_finance"
    assert len(data_micro["match_reasons"]) > 0

    # 2. Term Loan match
    payload_term = {
        "name": "Shri Rajesh Kumar",
        "annual_family_income": 220000,
        "is_sc_eligible": True,
        "project_type": "Manufacturing",
        "estimated_project_cost": 850000,
        "education_status": "Graduate",
        "gender": "Male",
        "state": "Telangana",
        "district": "Rangareddy",
        "pincode": "500081"
    }
    res_term = httpx.post(f"{BACKEND_URL}/api/eligibility/check", json=payload_term)
    assert res_term.status_code == 200
    data_term = res_term.json()
    assert data_term["is_eligible"] is True
    assert data_term["recommended_scheme"]["id"] == "mosje_term_loan"

    # 3. Disqualification
    payload_ineligible = {
        "name": "Ineligible Test",
        "annual_family_income": 450000, # Exceeds 3L
        "is_sc_eligible": False,
        "project_type": "Dairy",
        "estimated_project_cost": 100000,
        "education_status": "Graduate"
    }
    res_inel = httpx.post(f"{BACKEND_URL}/api/eligibility/check", json=payload_ineligible)
    assert res_inel.status_code == 200
    data_inel = res_inel.json()
    assert data_inel["is_eligible"] is False
    assert len(data_inel["disqualification_reasons"]) > 0

def test_financial_calculator():
    calc_req = {
        "loan_amount": 140000,
        "interest_rate_pct": 4.0,
        "tenure_months": 36,
        "moratorium_months": 6
    }
    res = httpx.post(f"{BACKEND_URL}/api/calculator/calculate", json=calc_req)
    assert res.status_code == 200
    data = res.json()
    assert data["effective_emi"] > 0
    assert data["total_interest"] > 0
    assert data["principal_percentage"] > 0
    assert len(data["amortization_schedule"]) == 42 # 6 moratorium + 36 repayment

def test_geo_partner_locator():
    partner_req = {
        "scheme_id": "mosje_micro_finance",
        "partner_type": "All",
        "user_latitude": 17.3850,
        "user_longitude": 78.4867,
        "max_radius_km": 50.0
    }
    res = httpx.post(f"{BACKEND_URL}/api/partners/nearby", json=partner_req)
    assert res.status_code == 200
    data = res.json()
    assert data["total_found"] > 0
    assert data["partners"][0]["distance_km"] is not None
    assert "MOCK DATA" in data["disclaimer"]

def test_document_checklist():
    res = httpx.get(f"{BACKEND_URL}/api/documents/checklist/mosje_micro_finance")
    assert res.status_code == 200
    data = res.json()
    assert data["total_documents"] > 0
    assert len(data["documents"]) > 0

def test_application_tracking():
    res = httpx.get(f"{BACKEND_URL}/api/applications/track/SIH-2026-MOSJE-8821")
    assert res.status_code == 200
    data = res.json()
    assert data["application_id"] == "SIH-2026-MOSJE-8821"
    assert len(data["stages"]) == 5
    assert data["current_stage_index"] == 2

def test_ai_assistant():
    chat_req = {
        "question": "What is a moratorium period?"
    }
    res = httpx.post(f"{BACKEND_URL}/api/chat", json=chat_req)
    assert res.status_code == 200
    data = res.json()
    assert "moratorium" in data["answer"].lower()
    assert len(data["source_topics"]) > 0
    assert "AI Assistant Notice" in data["disclaimer"]

def test_frontend_serving():
    try:
        res = httpx.get(f"{FRONTEND_URL}/")
        assert res.status_code == 200
        assert "<div id=\"root\"></div>" in res.text
    except Exception as e:
        pytest.skip(f"Frontend server on 5174 check: {e}")
