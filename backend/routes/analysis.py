from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from backend.workflows.pharma_graph import run_pharma_graph, Patient, Prescription

router = APIRouter()

class PatientInput(BaseModel):
    name: str
    age: int
    weight: float

class AnalyzeRequest(BaseModel):
    patient: PatientInput
    medications: List[str]

@router.post("/analysis")
async def analyze_interactions(data: AnalyzeRequest):
    try:
        # ✅ Properly construct the prescription before use
        patient = Patient(
            name=data.patient.name,
            age=data.patient.age,
            weight=data.patient.weight
        )
        prescription = Prescription(patient=patient, medications=data.medications)

        # ✅ Now safely pass it to the graph
        results = run_pharma_graph(prescription)

        return {
            "status": "success",
            "patient": data.patient,
            "medications": data.medications,
            "analysis": results
        }

    except Exception as e:
        print("❌ Error in /analysis route:", str(e))
        raise HTTPException(status_code=500, detail="Backend error occurred: " + str(e))
