# backend/routes/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from passlib.context import CryptContext

from backend.database.database import get_db
from backend.database.models import Doctor
from backend.auth.jwt_handler import create_access_token
from backend.utils.auth_utils import get_current_doctor

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Schemas
class DoctorRegister(BaseModel):
    name: str
    email: EmailStr
    password: str

class DoctorLogin(BaseModel):
    email: EmailStr
    password: str

@router.post("/register")
def register(data: DoctorRegister, db: Session = Depends(get_db)):
    # Ensure unique email
    if db.query(Doctor).filter(Doctor.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed = pwd_context.hash(data.password)
    doc = Doctor(name=data.name, email=data.email, hashed_password=hashed)
    db.add(doc)
    db.commit()
    db.refresh(doc)

    token = create_access_token({"sub": doc.email})
    return {"access_token": token, "token_type": "bearer", "name": doc.name, "email": doc.email}

@router.post("/login")
def login(data: DoctorLogin, db: Session = Depends(get_db)):
    doc = db.query(Doctor).filter(Doctor.email == data.email).first()
    if not doc or not pwd_context.verify(data.password, doc.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    token = create_access_token({"sub": doc.email})
    return {"access_token": token, "token_type": "bearer", "name": doc.name, "email": doc.email}

@router.get("/me")
def me(current: Doctor = Depends(get_current_doctor)):
    return {"name": current.name, "email": current.email, "specialization": current.specialization, "hospital": current.hospital}
