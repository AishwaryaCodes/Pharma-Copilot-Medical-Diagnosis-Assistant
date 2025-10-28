# routes/diagnosis.py
from datetime import datetime
from sqlalchemy.orm import Session
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.database.schemas import ReportCreate as PatientReportCreate, ReportResponse as PatientReportResponse

from backend.database.models import PatientReport
from backend.database.database import SessionLocal
from backend.services.diagnosis_pipeline import run_diagnosis_pipeline

router = APIRouter()

class DiagnosisRequest(BaseModel):
    name: str
    age: int
    medical_report: str

@router.post("/diagnose", response_model=PatientReportResponse)
def diagnose_patient(data: DiagnosisRequest):
    try:
        # Run diagnosis pipeline
        result = run_diagnosis_pipeline(data.name, data.age, data.medical_report)

        # Save to DB
        db = SessionLocal()
        report = PatientReport(
            name=result["name"],
            age=result["age"],
            medical_report=data.medical_report,
            cardiologist_result=result["cardiologist_result"],
            psychologist_result=result["psychologist_result"],
            pulmonologist_result=result["pulmonologist_result"],
            final_diagnosis=result["final_diagnosis"]
        )
        db.add(report)
        db.commit()
        db.refresh(report)
        db.close()

        return report

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Diagnosis failed: {str(e)}")
