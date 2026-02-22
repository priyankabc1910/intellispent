from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict

app = FastAPI()

# =========================
# CORS Configuration
# =========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for now
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# Request / Response Models
# =========================

class FinancialInput(BaseModel):
    income: float
    expenses: Dict[str, float]

class FinancialOutput(BaseModel):
    total_expenses: float
    savings: float
    savings_ratio: float
    risk_level: str


# =========================
# Routes
# =========================

@app.get("/")
def root():
    return {"message": "IntelliSpend API is running"}


@app.post("/analyze", response_model=FinancialOutput)
def analyze(data: FinancialInput):

    income = data.income
    expenses = data.expenses

    total_expenses = sum(expenses.values())
    savings = income - total_expenses

    savings_ratio = (savings / income) * 100 if income > 0 else 0

    # Risk logic
    if savings_ratio >= 30:
        risk = "Low"
    elif savings_ratio >= 10:
        risk = "Moderate"
    else:
        risk = "High"

    return {
        "total_expenses": total_expenses,
        "savings": savings,
        "savings_ratio": round(savings_ratio, 2),
        "risk_level": risk
    }