# db/models.py

from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class PatientReport(Base):
    __tablename__ = "patient_reports"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    age = Column(Integer, nullable=False)
    medical_report = Column(Text, nullable=False)
    cardiologist_result = Column(Text)
    psychologist_result = Column(Text)
    pulmonologist_result = Column(Text)
    final_diagnosis = Column(Text)
