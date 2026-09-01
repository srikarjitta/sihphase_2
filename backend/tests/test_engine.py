import pytest
import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from models.schemas import UserProfileRequest
from services.eligibility_engine import recommend_schemes

def test_micro_finance_recommendation():
    # Profile: SC rural artisan / dairy entrepreneur with project cost <= 2L
    user = UserProfileRequest(
        name="Lakshmi Devi",
        annual_family_income=120000.0,
        is_sc_eligible=True,
        project_type="Dairy",
        estimated_project_cost=140000.0,
        education_status="Working",
        gender="Female",
        state="Telangana",
        district="Hyderabad"
    )
    result = recommend_schemes(user)
    assert result.is_eligible is True
    assert result.recommended_scheme is not None
    assert result.recommended_scheme.id == "mosje_micro_finance"
    assert "Female beneficiaries receive an additional 0.5% interest rebate" in result.ai_explanation
    assert len(result.match_reasons) > 0

def test_term_loan_recommendation():
    # Profile: SC manufacturing enterprise with project cost 8L
    user = UserProfileRequest(
        name="Rajesh Kumar",
        annual_family_income=240000.0,
        is_sc_eligible=True,
        project_type="Manufacturing",
        estimated_project_cost=800000.0,
        education_status="Graduate",
        gender="Male",
        state="Telangana",
        district="Rangareddy"
    )
    result = recommend_schemes(user)
    assert result.is_eligible is True
    assert result.recommended_scheme is not None
    assert result.recommended_scheme.id == "mosje_term_loan"
    assert result.recommended_scheme.max_project_cost == 2000000

def test_education_loan_recommendation():
    # Profile: SC student pursuing professional degree
    user = UserProfileRequest(
        name="Kavita Reddy",
        annual_family_income=180000.0,
        is_sc_eligible=True,
        project_type="Education",
        estimated_project_cost=500000.0,
        education_status="Student",
        gender="Female"
    )
    result = recommend_schemes(user)
    assert result.is_eligible is True
    assert result.recommended_scheme is not None
    assert result.recommended_scheme.id == "mosje_educational_loan"

def test_income_disqualification():
    # Profile: Income exceeding 3L ceiling
    user = UserProfileRequest(
        name="Anil Kumar",
        annual_family_income=450000.0,
        is_sc_eligible=True,
        project_type="Retail / Shop",
        estimated_project_cost=100000.0,
        education_status="Graduate"
    )
    result = recommend_schemes(user)
    assert result.is_eligible is False
    assert result.recommended_scheme is None
    assert any("exceeds the scheme's statutory ceiling" in d for d in result.disqualification_reasons)

def test_sc_disqualification():
    # Profile: Non-SC applicant
    user = UserProfileRequest(
        name="Suresh Verma",
        annual_family_income=150000.0,
        is_sc_eligible=False,
        project_type="Dairy",
        estimated_project_cost=120000.0,
        education_status="Working"
    )
    result = recommend_schemes(user)
    assert result.is_eligible is False
    assert any("reserved for Scheduled Caste" in d for d in result.disqualification_reasons)
