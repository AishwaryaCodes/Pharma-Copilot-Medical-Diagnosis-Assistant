# backend/scripts/seed_reports.py
from datetime import datetime, timedelta
from backend.database import SessionLocal
from backend.database.models import Doctor, Diagnosis
from backend.utils.security import hash_password  # adjust if your hasher is elsewhere

def ensure_doctor(db):
    email = "demo@clinic.test"
    doc = db.query(Doctor).filter(Doctor.email == email).first()
    if doc:
        return doc
    d = Doctor(
        name="Demo Doctor",
        email=email,
        hashed_password=hash_password("demo123"),
        specialization="General",
        hospital="Demo Hospital",
    )
    db.add(d)
    db.commit()
    db.refresh(d)
    return d

def main():
    db = SessionLocal()
    try:
        doc = ensure_doctor(db)
        now = datetime.utcnow()
        rows = [
            Diagnosis(
                doctor_id=doc.id,
                patient_name="John Doe",
                patient_age=44,
                medical_report="Chest pain, normal ECG, negative troponin.",
                final_diagnosis="Non-cardiac chest pain",
                created_at=now - timedelta(days=1),
            ),
            Diagnosis(
                doctor_id=doc.id,
                patient_name="Maria Gomez",
                patient_age=31,
                medical_report="Fever, sore throat, congestion.",
                final_diagnosis="Viral URI",
                created_at=now - timedelta(days=3),
            ),
            Diagnosis(
                doctor_id=doc.id,
                patient_name="Li Wei",
                patient_age=57,
                medical_report="Dyspnea on exertion, mild wheeze.",
                final_diagnosis="Mild persistent asthma",
                created_at=now - timedelta(days=6),
            ),
        ]
        db.add_all(rows)
        db.commit()
        print(f"✅ Seeded {len(rows)} diagnoses for {doc.email}. Password: demo123")
    finally:
        db.close()

if __name__ == "__main__":
    main()
