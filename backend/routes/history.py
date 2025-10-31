# backend/routes/history.py
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from backend.database import SessionLocal
from backend.database.models import Diagnosis
from backend.utils.auth_utils import get_current_doctor

router = APIRouter(prefix="/history", tags=["history"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("")
def list_history(
    q: str = Query("", description="Search query"),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    doctor = Depends(get_current_doctor),
):
    query = db.query(Diagnosis).filter(Diagnosis.doctor_id == doctor.id)
    if q:
        pattern = f"%{q}%"
        query = query.filter(
            (Diagnosis.patient_name.ilike(pattern)) |
            (Diagnosis.medical_report.ilike(pattern)) |
            (Diagnosis.final_diagnosis.ilike(pattern))
        )
    items = (
        query
        .order_by(Diagnosis.created_at.desc())
        .limit(limit)
        .all()
    )
    # Shape for the frontend
    return {
        "items": [
            {
                "id": d.id,
                "name": d.patient_name,
                "age": d.patient_age,
                "medical_report": d.medical_report,
                "final_diagnosis": d.final_diagnosis,
                "created_at": d.created_at.isoformat() if d.created_at else None,
            }
            for d in items
        ]
    }
