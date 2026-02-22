

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import os
from typing import Dict

app = FastAPI()

# ---------------------------
# CORS (IMPORTANT for Lovable)
# ---------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_FILE = "data.json"

# ---------------------------
# Utility Functions
# ---------------------------

def load_data():
    if not os.path.exists(DATA_FILE):
        return {"income": 0, "expenses": []}
    with open(DATA_FILE, "r") as f:
        return json.load(f)

def save_data(data):
    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=4)


# ---------------------------
# Request Model
# ---------------------------

class FinanceInput(BaseModel):
    income: float
    expenses: Dict[str, float]


# ---------------------------
# Financial Intelligence Logic
# ---------------------------

def analyze_finance(income, expenses_dict):

    total_expense = sum(expenses_dict.values())
    savings = income - total_expense

    savings_ratio = savings / income if income > 0 else 0

    # Discretionary categories (optional logic)
    discretionary_categories = ["entertainment", "shopping", "travel", "luxury"]
    discretionary_spend = sum(
        expenses_dict.get(cat, 0) for cat in discretionary_categories
    )

    discretionary_ratio = (
        discretionary_spend / total_expense if total_expense > 0 else 0
    )

    # Behavior Classification
    if savings_ratio > 0.4:
        profile = "Conservative Planner"
    elif discretionary_ratio > 0.5:
        profile = "Impulsive Spender"
    elif savings_ratio < 0.1:
        profile = "Financially Vulnerable"
    else:
        profile = "Balanced Budgeter"

    # Risk Score (0–100)
    risk_score = 0

    if savings_ratio < 0.1:
        risk_score += 40
    if discretionary_ratio > 0.4:
        risk_score += 30
    if savings < 0:
        risk_score += 30

    risk_score = min(risk_score, 100)

    return {
        "total_expense": total_expense,
        "savings": savings,
        "savings_ratio": round(savings_ratio, 2),
        "profile": profile,
        "risk_score": risk_score
    }


# ---------------------------
# API Endpoints
# ---------------------------

@app.post("/analyze")
def analyze(input: FinanceInput):

    data = load_data()

    data["income"] = input.income
    data["expenses"] = input.expenses

    save_data(data)

    result = analyze_finance(input.income, input.expenses)

    return result


@app.get("/")
def root():
    return {"message": "IntelliSpend API is running"}