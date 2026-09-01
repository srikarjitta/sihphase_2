from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class UserProfileRequest(BaseModel):
    name: str = Field(..., description="Applicant's Full Name")
    annual_family_income: float = Field(..., ge=0, description="Annual Family Income in INR")
    is_sc_eligible: bool = Field(..., description="Belongs to Scheduled Caste (SC) / Target Category")
    project_type: str = Field(..., description="Type of project: Dairy, Agriculture, Retail / Shop, Manufacturing, Service, Education, Other")
    estimated_project_cost: float = Field(..., gt=0, description="Estimated Total Project Cost in INR")
    education_status: str = Field(..., description="Student, Graduate, Working, Other")
    gender: Optional[str] = Field("All", description="Gender (Male, Female, Transgender)")
    state: Optional[str] = "Telangana"
    district: Optional[str] = "Hyderabad"
    pincode: Optional[str] = "500001"
    latitude: Optional[float] = 17.3850
    longitude: Optional[float] = 78.4867

class SchemeModel(BaseModel):
    id: str
    code: str
    name: str
    short_name: str
    corporation: str
    category: str
    description: str
    min_project_cost: float
    max_project_cost: float
    max_loan_percentage: float
    interest_rate_pct: float
    female_rebate_pct: float
    max_tenure_months: int
    min_tenure_months: int
    moratorium_months_min: int
    moratorium_months_max: int
    income_limit_annual: float
    sc_required: bool
    eligible_project_types: List[str]
    eligible_education_levels: List[str]
    key_benefits: List[str]
    required_documents: List[str]

class MatchEvaluation(BaseModel):
    scheme: SchemeModel
    is_eligible: bool
    match_score: int
    reasons: List[str]
    disqualifications: List[str]

class RecommendationResponse(BaseModel):
    is_eligible: bool
    applicant_name: str
    project_type: str
    estimated_project_cost: float
    recommended_scheme: Optional[SchemeModel] = None
    alternative_schemes: List[SchemeModel] = []
    match_reasons: List[str] = []
    disqualification_reasons: List[str] = []
    ai_explanation: str
    disclaimer: str

class CalculatorRequest(BaseModel):
    loan_amount: float = Field(..., gt=0, description="Principal Loan Amount in INR")
    interest_rate_pct: float = Field(..., gt=0, description="Annual Interest Rate Percentage")
    tenure_months: int = Field(..., gt=0, description="Loan Repayment Tenure in Months")
    moratorium_months: int = Field(0, ge=0, description="Moratorium / Grace Period in Months")

class AmortizationRow(BaseModel):
    month: int
    is_moratorium: bool
    principal_payment: float
    interest_payment: float
    total_installment: float
    remaining_balance: float

class CalculatorResponse(BaseModel):
    principal_amount: float
    interest_rate_pct: float
    tenure_months: int
    moratorium_months: int
    effective_emi: float
    total_interest: float
    total_repayment: float
    principal_percentage: float
    interest_percentage: float
    amortization_schedule: List[AmortizationRow]
    disclaimer: str

class PartnerFilterRequest(BaseModel):
    scheme_id: Optional[str] = None
    partner_type: Optional[str] = None
    user_latitude: Optional[float] = 17.3850
    user_longitude: Optional[float] = 78.4867
    max_radius_km: Optional[float] = 50.0

class ChannelPartnerModel(BaseModel):
    id: str
    name: str
    partner_type: str
    latitude: float
    longitude: float
    address: str
    district: str
    state: str
    phone: str
    email: str
    supported_schemes: List[str]
    operational_status: str
    fund_utilization_rating: str
    branch_manager: str
    timings: str
    distance_km: Optional[float] = None
    is_recommended: Optional[bool] = False

class PartnerListResponse(BaseModel):
    user_location: Dict[str, float]
    total_found: int
    partners: List[ChannelPartnerModel]
    disclaimer: str

class DocumentItem(BaseModel):
    id: str
    title: str
    description: str
    mandatory: bool
    status: str  # "Not Uploaded", "Uploaded", "Verified"
    verification_notes: Optional[str] = None

class DocumentChecklistResponse(BaseModel):
    scheme_id: str
    scheme_name: str
    total_documents: int
    completed_documents: int
    completion_percentage: float
    documents: List[DocumentItem]
    disclaimer: str

class ApplicationTrackRequest(BaseModel):
    application_id: str

class TrackingStage(BaseModel):
    stage_number: int
    title: str
    description: str
    status: str  # "Completed", "In Progress", "Pending"
    date: Optional[str] = None

class ApplicationTrackResponse(BaseModel):
    application_id: str
    applicant_name: str
    scheme_name: str
    channel_partner_name: str
    submission_date: str
    current_status: str
    current_stage_index: int
    stages: List[TrackingStage]
    remarks: str

class ChatRequest(BaseModel):
    question: str
    language: Optional[str] = "en"
    user_context: Optional[Dict[str, Any]] = None

class ChatResponse(BaseModel):
    answer: str
    source_topics: List[str]
    suggested_followups: List[str]
    disclaimer: str
