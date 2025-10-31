# backend/routes/diagnosis.py
# add this import
from datetime import datetime

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel

from backend.database.database import get_db
from backend.database.models import Diagnosis
from backend.services.diagnosis_pipeline import run_diagnosis_pipeline
from backend.utils.auth_utils import get_current_doctor

router = APIRouter()

class DiagnosisRequest(BaseModel):
    name: str
    age: int
    medical_report: str

@router.post("/diagnose")
def diagnose(
    payload: DiagnosisRequest,
    db: Session = Depends(get_db),
    current_doctor = Depends(get_current_doctor),
):
    try:
        result = run_diagnosis_pipeline(
            name=payload.name,
            age=payload.age,
            medical_report=payload.medical_report,
        )

        row = Diagnosis(
            doctor_id=current_doctor.id,
            patient_name=payload.name,
            patient_age=payload.age,
            medical_report=payload.medical_report,      # ✅ persist it
            cardiologist_result=result["cardiologist_result"],
            psychologist_result=result["psychologist_result"],
            pulmonologist_result=result["pulmonologist_result"],
            final_diagnosis=result["final_diagnosis"],
            created_at=datetime.utcnow(),
        )

        db.add(row)
        db.commit()
        db.refresh(row)

        return {
            "id": row.id,
            "name": row.patient_name,
            "age": row.patient_age,
            "medical_report": row.medical_report,
            "cardiologist_result": row.cardiologist_result,
            "psychologist_result": row.psychologist_result,
            "pulmonologist_result": row.pulmonologist_result,
            "final_diagnosis": row.final_diagnosis,
            "created_at": row.created_at,
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Diagnosis failed: {e}")
