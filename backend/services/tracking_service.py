import datetime
import json
import os
from typing import Dict, List, Optional
from models.schemas import (
    DocumentItem, DocumentChecklistResponse, 
    ApplicationTrackResponse, TrackingStage
)

SCHEMES_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "schemes.json")

# In-memory mock application storage for prototype sessions
MOCK_APPLICATIONS: Dict[str, Dict] = {
    "SIH-2026-MOSJE-8821": {
        "application_id": "SIH-2026-MOSJE-8821",
        "applicant_name": "Smt. K. Lakshmi",
        "scheme_name": "Micro Credit Finance Scheme (Mahila Samriddhi & Micro Finance)",
        "channel_partner_name": "Telangana Scheduled Castes Co-Op Dev Corp (TSSCCDC - SCA)",
        "submission_date": "2026-08-20",
        "current_status": "Under Processing",
        "current_stage_index": 2, # 0-indexed: 2 is Stage 3 (Under Processing)
        "remarks": "Documents preliminary verification passed. Physical inspection and project appraisal scheduled by SCA Field Officer."
    },
    "SIH-2026-MOSJE-9042": {
        "application_id": "SIH-2026-MOSJE-9042",
        "applicant_name": "Shri Rajesh Kumar",
        "scheme_name": "Term Loan Scheme for Viable Commercial & Manufacturing Enterprises",
        "channel_partner_name": "State Bank of India - Special Social Banking Branch (PSB)",
        "submission_date": "2026-08-15",
        "current_status": "Sanction",
        "current_stage_index": 3,
        "remarks": "Credit appraisal complete. In-principle sanction letter issued for ₹6,50,000 at 6.5% interest."
    }
}

def get_document_checklist(scheme_id: str) -> DocumentChecklistResponse:
    with open(SCHEMES_FILE, "r", encoding="utf-8") as f:
        schemes = json.load(f)
        
    selected_scheme = next((s for s in schemes if s["id"] == scheme_id), None)
    if not selected_scheme:
        # Default to micro finance if not found
        selected_scheme = schemes[0]
        
    doc_titles = selected_scheme.get("required_documents", [])
    
    items: List[DocumentItem] = []
    for idx, title in enumerate(doc_titles):
        desc = "Official government-issued document required for eligibility verification."
        if "Caste" in title:
            desc = "Issued by competent Tehsildar / MeeSeva / e-District portal verifying SC status."
        elif "Income" in title:
            desc = "Annual family income certificate (< ₹3,00,000) or valid BPL Ration Card."
        elif "Identity" in title or "KYC" in title:
            desc = "Applicant's Aadhaar Card (linked with mobile) and Voter ID."
        elif "Bank" in title:
            desc = "Photocopy of active bank account passbook with IFSC code and applicant's name."
        elif "Project" in title or "Proposal" in title:
            desc = "Simple project outline or DPR stating equipment costs, revenue projection, and shop/unit location."
        elif "Admission" in title:
            desc = "Official allotment letter or admission confirmation from UGC/AICTE approved college."
            
        items.append(
            DocumentItem(
                id=f"doc_{idx+1}",
                title=title,
                description=desc,
                mandatory=True,
                status="Verified" if idx == 0 else ("Uploaded" if idx == 1 else "Not Uploaded"),
                verification_notes="Mock verified via DigiLocker API" if idx == 0 else None
            )
        )
        
    completed = sum(1 for d in items if d.status in ["Uploaded", "Verified"])
    total = len(items)
    pct = round((completed / total) * 100.0, 1) if total > 0 else 0.0

    return DocumentChecklistResponse(
        scheme_id=selected_scheme["id"],
        scheme_name=selected_scheme["short_name"],
        total_documents=total,
        completed_documents=completed,
        completion_percentage=pct,
        documents=items,
        disclaimer="Prototype Document Checklist: Real-time verification is simulated. Physical/digital copies will be submitted to the authorized Channel Partner."
    )

def track_application(application_id: str) -> ApplicationTrackResponse:
    app_data = MOCK_APPLICATIONS.get(
        application_id.strip().upper(),
        # fallback default mock
        {
            "application_id": application_id.strip().upper(),
            "applicant_name": "Demo Applicant",
            "scheme_name": "Micro Credit Finance Scheme (NSFDC)",
            "channel_partner_name": "State Channelizing Agency (SCA MASAB TANK)",
            "submission_date": datetime.date.today().strftime("%Y-%m-%d"),
            "current_status": "Application Submitted",
            "current_stage_index": 0,
            "remarks": "Application registered successfully. Assigned to Channel Partner Desk for scrutiny."
        }
    )

    stage_defs = [
        ("Application Submitted", "Application received digitally via MoSJE Scheme Matching Portal"),
        ("Documents Verified", "Caste certificate, income proof, and KYC verified by SCA/Bank nodal officer"),
        ("Under Processing", "Field appraisal, project viability inspection, and credit score review"),
        ("Sanction", "Sanction letter issued with interest rate subvention parameters"),
        ("Disbursement", "Direct Benefit Transfer (DBT) / Bank credit to applicant's Aadhaar-linked account")
    ]

    stages: List[TrackingStage] = []
    curr_idx = app_data["current_stage_index"]

    for i, (title, desc) in enumerate(stage_defs):
        if i < curr_idx:
            status = "Completed"
            d = "Completed on " + (datetime.date.today() - datetime.timedelta(days=(curr_idx - i) * 3)).strftime("%d %b %Y")
        elif i == curr_idx:
            status = "In Progress"
            d = "In Progress as of " + datetime.date.today().strftime("%d %b %Y")
        else:
            status = "Pending"
            d = "Estimated in next stage"

        stages.append(
            TrackingStage(
                stage_number=i+1,
                title=title,
                description=desc,
                status=status,
                date=d
            )
        )

    return ApplicationTrackResponse(
        application_id=app_data["application_id"],
        applicant_name=app_data["applicant_name"],
        scheme_name=app_data["scheme_name"],
        channel_partner_name=app_data["channel_partner_name"],
        submission_date=app_data["submission_date"],
        current_status=app_data["current_status"],
        current_stage_index=curr_idx,
        stages=stages,
        remarks=app_data["remarks"]
    )
