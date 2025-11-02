# backend/database/models.py
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Text
from sqlalchemy.orm import relationship
from .database import Base

class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    specialization = Column(String, nullable=True)
    hospital = Column(String, nullable=True)

    diagnoses = relationship(
        "Diagnosis",
        back_populates="doctor",
        cascade="all, delete-orphan"
    )

class Diagnosis(Base):
    __tablename__ = "diagnoses"

    id = Column(Integer, primary_key=True, index=True)
    doctor_id = Column(Integer, ForeignKey("doctors.id"), index=True, nullable=False)
    patient_name = Column(String, nullable=False)
    patient_age = Column(Integer, nullable=True)
    medical_report = Column(Text, nullable=True)

    cardiologist_result = Column(Text, nullable=True)
    psychologist_result = Column(Text, nullable=True)
    pulmonologist_result = Column(Text, nullable=True)
    final_diagnosis = Column(Text, nullable=True)

    ai_seconds = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    doctor = relationship("Doctor", back_populates="diagnoses")
