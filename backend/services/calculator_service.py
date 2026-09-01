import math
from typing import List
from models.schemas import CalculatorRequest, CalculatorResponse, AmortizationRow

def calculate_financials(req: CalculatorRequest) -> CalculatorResponse:
    P = float(req.loan_amount)
    annual_rate = float(req.interest_rate_pct)
    tenure_months = int(req.tenure_months)
    moratorium_months = int(req.moratorium_months)

    monthly_rate = (annual_rate / 100.0) / 12.0
    
    # Repayment duration after moratorium
    repayment_months = tenure_months
    
    if monthly_rate == 0 or repayment_months == 0:
        emi = P / max(1, repayment_months)
    else:
        # Standard EMI formula: P * r * (1+r)^n / ((1+r)^n - 1)
        factor = math.pow(1.0 + monthly_rate, repayment_months)
        emi = P * monthly_rate * factor / (factor - 1.0)
    
    amortization_schedule: List[AmortizationRow] = []
    current_balance = P
    total_interest_accumulated = 0.0

    # 1. Moratorium Period Months
    for m in range(1, moratorium_months + 1):
        moratorium_interest = current_balance * monthly_rate
        total_interest_accumulated += moratorium_interest
        amortization_schedule.append(
            AmortizationRow(
                month=m,
                is_moratorium=True,
                principal_payment=0.0,
                interest_payment=round(moratorium_interest, 2),
                total_installment=round(moratorium_interest, 2),
                remaining_balance=round(current_balance, 2)
            )
        )

    # 2. Amortized Repayment Months
    for m in range(1, repayment_months + 1):
        interest_for_month = current_balance * monthly_rate
        principal_for_month = emi - interest_for_month
        
        # Handle rounding on final month
        if m == repayment_months or current_balance < principal_for_month:
            principal_for_month = current_balance
            total_installment = principal_for_month + interest_for_month
            current_balance = 0.0
        else:
            current_balance -= principal_for_month
            total_installment = emi
            
        total_interest_accumulated += interest_for_month
        
        amortization_schedule.append(
            AmortizationRow(
                month=moratorium_months + m,
                is_moratorium=False,
                principal_payment=round(principal_for_month, 2),
                interest_payment=round(interest_for_month, 2),
                total_installment=round(total_installment, 2),
                remaining_balance=round(max(0.0, current_balance), 2)
            )
        )

    total_repayment = P + total_interest_accumulated
    principal_pct = (P / total_repayment) * 100.0 if total_repayment > 0 else 100.0
    interest_pct = (total_interest_accumulated / total_repayment) * 100.0 if total_repayment > 0 else 0.0

    disclaimer = (
        "Estimated figures based on mathematical calculation. Exact EMI, processing fees, "
        "and subsidy adjustments depend on Channel Partner terms and prevailing interest rates."
    )

    return CalculatorResponse(
        principal_amount=round(P, 2),
        interest_rate_pct=round(annual_rate, 2),
        tenure_months=tenure_months,
        moratorium_months=moratorium_months,
        effective_emi=round(emi, 2),
        total_interest=round(total_interest_accumulated, 2),
        total_repayment=round(total_repayment, 2),
        principal_percentage=round(principal_pct, 1),
        interest_percentage=round(interest_pct, 1),
        amortization_schedule=amortization_schedule,
        disclaimer=disclaimer
    )
