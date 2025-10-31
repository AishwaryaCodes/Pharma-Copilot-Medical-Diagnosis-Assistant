# backend/routes/dashboard.py
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from datetime import datetime, timedelta

from backend.database.database import get_db
from backend.database.models import Doctor, Diagnosis
from backend.utils.auth_utils import get_current_doctor  # <- unified import

router = APIRouter()

def _is_llm_error(text: str | None) -> bool:
    if not text:
        return False
    return str(text).startswith("[LLM Error]")

@router.get("/me")
def me(
    db: Session = Depends(get_db),
    current: Doctor = Depends(get_current_doctor),
):
    doc = db.query(Doctor).filter(Doctor.id == current.id).first()
    return {
        "id": doc.id,
        "name": doc.name,
        "email": doc.email,
        "specialization": doc.specialization or "General Practitioner",
        "hospital": doc.hospital or "",
    }

@router.get("/reports")
def recent_reports(
    limit: int = Query(5, ge=1, le=50),
    db: Session = Depends(get_db),
    current: Doctor = Depends(get_current_doctor),
):
    rows = (
        db.query(Diagnosis)
        .filter(Diagnosis.doctor_id == current.id)
        .order_by(desc(Diagnosis.created_at))
        .limit(limit)
        .all()
    )
    items = []
    for r in rows:
        items.append({
            "id": r.id,
            "name": r.patient_name,
            "age": r.patient_age,
            "final_diagnosis": r.final_diagnosis,
            "created_at": r.created_at,
            "cardiologist_result": r.cardiologist_result,
            "psychologist_result": r.psychologist_result,
            "pulmonologist_result": r.pulmonologist_result,
        })
    return {"items": items}

@router.get("/stats/overview")
def stats_overview(
    db: Session = Depends(get_db),
    current: Doctor = Depends(get_current_doctor),
):
    since = datetime.utcnow() - timedelta(days=7)
    rows = (
        db.query(Diagnosis)
        .filter(Diagnosis.doctor_id == current.id, Diagnosis.created_at >= since)
        .all()
    )

    patients_7d = len(rows)

    try:
        avg_turnaround_seconds = round(
            sum((r.ai_seconds or 8.5) for r in rows) / max(1, patients_7d), 1
        )
    except Exception:
        avg_turnaround_seconds = 8.5

    ok = 0
    for r in rows:
        any_err = any([
            _is_llm_error(r.cardiologist_result),
            _is_llm_error(r.psychologist_result),
            _is_llm_error(r.pulmonologist_result),
            _is_llm_error(r.final_diagnosis),
        ])
        if not any_err:
            ok += 1

    llm_success_rate = (ok / max(1, patients_7d)) if patients_7d else 1.0

    saved_reports = (
        db.query(func.count(Diagnosis.id))
        .filter(Diagnosis.doctor_id == current.id)
        .scalar()
    )

    return {
        "patients_7d": patients_7d,
        "avg_turnaround_seconds": avg_turnaround_seconds,
        "llm_success_rate": llm_success_rate,
        "saved_reports": saved_reports,
    }

@router.get("/stats/trends")
def stats_trends(
    db: Session = Depends(get_db),
    current: Doctor = Depends(get_current_doctor),
):
    since = datetime.utcnow() - timedelta(weeks=4)
    # SQLite week-of-year label
    week_label = func.strftime('%W', Diagnosis.created_at)

    rows = (
        db.query(week_label.label("wk"), func.count(Diagnosis.id))
        .filter(Diagnosis.doctor_id == current.id, Diagnosis.created_at >= since)
        .group_by("wk")
        .order_by("wk")
        .all()
    )

    # Normalize to W1..W4
    counts = [{"week": f"W{i+1}", "patients": 0} for i in range(4)]
    for i, (_wk, cnt) in enumerate(rows[-4:]):
        counts[-len(rows) + i]["patients"] = cnt

    return counts
