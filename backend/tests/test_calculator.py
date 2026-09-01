import pytest
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from models.schemas import CalculatorRequest
from services.calculator_service import calculate_financials

def test_standard_emi_calculation():
    # 1 Lakh at 12% for 12 months, 0 moratorium
    # P = 100000, r = 0.01 per month, n = 12
    # Standard EMI ~ 8884.88
    req = CalculatorRequest(
        loan_amount=100000.0,
        interest_rate_pct=12.0,
        tenure_months=12,
        moratorium_months=0
    )
    res = calculate_financials(req)
    assert round(res.effective_emi, 2) == 8884.88
    assert res.moratorium_months == 0
    assert len(res.amortization_schedule) == 12
    assert res.total_repayment > 100000.0

def test_concessional_micro_finance_emi():
    # 1.4 Lakh at 4% for 36 months, 6 months moratorium
    req = CalculatorRequest(
        loan_amount=140000.0,
        interest_rate_pct=4.0,
        tenure_months=36,
        moratorium_months=6
    )
    res = calculate_financials(req)
    # Check that first 6 months are moratorium rows
    for i in range(6):
        assert res.amortization_schedule[i].is_moratorium is True
        assert res.amortization_schedule[i].principal_payment == 0.0
    
    # Check that remaining 36 months are amortized
    assert len(res.amortization_schedule) == 42
    assert res.amortization_schedule[6].is_moratorium is False
    assert res.effective_emi > 0

def test_zero_moratorium_schedule():
    req = CalculatorRequest(
        loan_amount=500000.0,
        interest_rate_pct=6.5,
        tenure_months=60,
        moratorium_months=0
    )
    res = calculate_financials(req)
    assert len(res.amortization_schedule) == 60
    assert res.amortization_schedule[-1].remaining_balance == 0.0
