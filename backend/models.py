# backend/models.py

class Patient:
    def __init__(self, name: str, age: int, weight: float):
        self.name = name
        self.age = age
        self.weight = weight

class Prescription:
    def __init__(self, patient: Patient, medications: list[str]):
        self.patient = patient
        self.medications = medications
