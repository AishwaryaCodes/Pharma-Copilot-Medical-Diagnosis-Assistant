# db/schemas.py

from pydantic import BaseModel

class ReportBase(BaseModel):
    name: str
    age: int
    medical_report: str

class ReportCreate(ReportBase):
    pass

class ReportResponse(ReportBase):
    id: int
    cardiologist_result: str
    psychologist_result: str
    pulmonologist_result: str
    final_diagnosis: str

    class Config:
        orm_mode = True
