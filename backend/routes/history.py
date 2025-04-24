# routes/history.py
from fastapi import APIRouter, Query
from backend.database.database import SessionLocal
from backend.database.models import PatientReport
from typing import List

router = APIRouter()

@router.get("/history")
def get_all_reports():
    db = SessionLocal()
    reports = db.query(PatientReport).all()
    db.close()
    return reports
