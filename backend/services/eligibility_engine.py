import json
import os
from typing import List, Dict, Any, Tuple
from models.schemas import UserProfileRequest, SchemeModel, MatchEvaluation, RecommendationResponse

SCHEMES_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "schemes.json")

def load_schemes() -> List[SchemeModel]:
    with open(SCHEMES_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
    return [SchemeModel(**item) for item in data]

def evaluate_scheme(user: UserProfileRequest, scheme: SchemeModel) -> MatchEvaluation:
    reasons = []
    disqualifications = []
    match_score = 0

    # 1. SC / Target Beneficiary check
    if scheme.sc_required:
        if not user.is_sc_eligible:
            disqualifications.append("This scheme is reserved for Scheduled Caste (SC) / Target Category beneficiaries under MoSJE guidelines.")
        else:
            reasons.append("Applicant belongs to the eligible SC / Target Category beneficiary group.")
            match_score += 30

    # 2. Annual Income Ceiling check
    if user.annual_family_income > scheme.income_limit_annual:
        disqualifications.append(
            f"Annual family income (₹{user.annual_family_income:,.0f}) exceeds the scheme's statutory ceiling of ₹{scheme.income_limit_annual:,.0f}."
        )
    else:
        reasons.append(
            f"Annual family income (₹{user.annual_family_income:,.0f}) is within the allowable limit of ₹{scheme.income_limit_annual:,.0f}."
        )
        match_score += 25

    # 3. Project Type Compatibility check
    if user.project_type in scheme.eligible_project_types:
        reasons.append(f"Proposed project type '{user.project_type}' is fully supported under {scheme.short_name}.")
        match_score += 20
    else:
        disqualifications.append(
            f"Project type '{user.project_type}' is not recognized under {scheme.short_name}. Supported types: {', '.join(scheme.eligible_project_types)}."
        )

    # 4. Project Cost Threshold check
    cost = user.estimated_project_cost
    if scheme.id == "mosje_micro_finance":
        if cost <= scheme.max_project_cost:
            reasons.append(f"Project cost of ₹{cost:,.0f} fits within Micro Finance maximum limit of ₹{scheme.max_project_cost:,.0f}.")
            match_score += 25
        else:
            disqualifications.append(
                f"Project cost of ₹{cost:,.0f} exceeds the Micro Finance ceiling of ₹{scheme.max_project_cost:,.0f}."
            )
    elif scheme.id == "mosje_term_loan":
        if cost >= scheme.min_project_cost and cost <= scheme.max_project_cost:
            reasons.append(f"Project cost of ₹{cost:,.0f} matches Term Loan requirements (₹{scheme.min_project_cost:,.0f} - ₹{scheme.max_project_cost:,.0f}).")
            match_score += 25
        elif cost < scheme.min_project_cost:
            # Maybe micro finance is better
            disqualifications.append(
                f"Project cost of ₹{cost:,.0f} is below the typical ₹{scheme.min_project_cost:,.0f} minimum for Term Loans (Micro Finance is recommended for smaller amounts)."
            )
        else:
            disqualifications.append(
                f"Project cost of ₹{cost:,.0f} exceeds the maximum Term Loan ceiling of ₹{scheme.max_project_cost:,.0f}."
            )
    elif scheme.id == "mosje_educational_loan":
        if user.project_type == "Education":
            if cost <= scheme.max_project_cost:
                reasons.append(f"Educational cost of ₹{cost:,.0f} is eligible for concessional education finance.")
                match_score += 25
            else:
                disqualifications.append(f"Requested education loan amount exceeds maximum ceiling of ₹{scheme.max_project_cost:,.0f}.")
        else:
            disqualifications.append("Educational loan is strictly reserved for higher/professional education purposes.")

    # 5. Education Level Compatibility
    if user.education_status in scheme.eligible_education_levels:
        match_score += 10
    else:
        if scheme.id == "mosje_educational_loan":
            disqualifications.append(f"Applicant status '{user.education_status}' does not meet student admission requirements for Educational Loans.")

    is_eligible = len(disqualifications) == 0

    return MatchEvaluation(
        scheme=scheme,
        is_eligible=is_eligible,
        match_score=match_score if is_eligible else 0,
        reasons=reasons,
        disqualifications=disqualifications
    )

def generate_ai_explanation(user: UserProfileRequest, recommended: SchemeModel, reasons: List[str]) -> str:
    """
    Generates a structured, plain-language explanation of the recommendation.
    """
    rebate_note = " Female beneficiaries receive an additional 0.5% interest rebate." if user.gender.lower() in ["female", "woman"] else ""
    
    explanation = (
        f"Based on your profile, {recommended.short_name} offered by {recommended.corporation} is the optimal match. "
        f"Your proposed {user.project_type} project cost of ₹{user.estimated_project_cost:,.0f} aligns with the scheme's funding structure (up to {recommended.max_loan_percentage:.0f}% financing). "
        f"You will benefit from a low concessional interest rate of {recommended.interest_rate_pct:.1f}% p.a.{rebate_note} "
        f"A flexible moratorium of {recommended.moratorium_months_min} to {recommended.moratorium_months_max} months is available so you can establish operations before repayment begins."
    )
    return explanation

def recommend_schemes(user: UserProfileRequest) -> RecommendationResponse:
    schemes = load_schemes()
    evaluations: List[MatchEvaluation] = [evaluate_scheme(user, s) for s in schemes]

    # Filter eligible
    eligible_evals = [e for e in evaluations if e.is_eligible]
    eligible_evals.sort(key=lambda x: x.match_score, reverse=True)

    disclaimer = (
        "Important Notice: All recommendations generated by this prototype are indicative and intended for guidance. "
        "Final eligibility, appraisal, credit evaluation, and sanction depend on official guidelines and the authorized Channel Partner (SCA / Bank)."
    )

    if eligible_evals:
        best_match = eligible_evals[0]
        alternatives = [e.scheme for e in eligible_evals[1:]]
        ai_exp = generate_ai_explanation(user, best_match.scheme, best_match.reasons)

        return RecommendationResponse(
            is_eligible=True,
            applicant_name=user.name,
            project_type=user.project_type,
            estimated_project_cost=user.estimated_project_cost,
            recommended_scheme=best_match.scheme,
            alternative_schemes=alternatives,
            match_reasons=best_match.reasons,
            disqualification_reasons=[],
            ai_explanation=ai_exp,
            disclaimer=disclaimer
        )
    else:
        # Collect all disqualifications
        all_disqualifications = []
        for e in evaluations:
            for d in e.disqualifications:
                if d not in all_disqualifications:
                    all_disqualifications.append(f"[{e.scheme.short_name}] {d}")

        ai_exp = (
            "We could not find an exact match among the prototype MoSJE credit schemes for your current profile. "
            "Please review the specific criteria below (such as target beneficiary category, annual income limit, or project cost range) "
            "or contact your nearest State Channelizing Agency for specialized state-level welfare programs."
        )

        return RecommendationResponse(
            is_eligible=False,
            applicant_name=user.name,
            project_type=user.project_type,
            estimated_project_cost=user.estimated_project_cost,
            recommended_scheme=None,
            alternative_schemes=[],
            match_reasons=[],
            disqualification_reasons=all_disqualifications,
            ai_explanation=ai_exp,
            disclaimer=disclaimer
        )
