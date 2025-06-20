# backend/routes/auth.py

from fastapi import APIRouter, Depends, HTTPException  # <-- You missed HTTPException here
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from backend.database.database import SessionLocal
from passlib.context import CryptContext
from backend.database.doctor import Doctor
from backend.auth.jwt_handler import create_access_token
from backend.utils.auth_utils import get_current_doctor

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Registration model
class DoctorRegister(BaseModel):
    name: str
    email: EmailStr
    password: str

# Login model
class DoctorLogin(BaseModel):
    email: EmailStr
    password: str

# DB session dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register")
def register_user(data: DoctorRegister, db: Session = Depends(get_db)):
    hashed_pw = pwd_context.hash(data.password)
    new_doctor = Doctor(
        name=data.name,
        email=data.email,
        hashed_password=hashed_pw
    )
    db.add(new_doctor)
    db.commit()
    db.refresh(new_doctor)
    return {"message": "Doctor registered successfully."}


@router.post("/login")
def login_user(data: DoctorLogin, db: Session = Depends(get_db)):
    doctor = db.query(Doctor).filter(Doctor.email == data.email).first()
    if not doctor or not pwd_context.verify(data.password, doctor.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(data={"sub": doctor.email})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "message": f"Welcome back, Dr. {doctor.name}!"
    }

@router.get("/me")
def get_logged_in_user(doctor: Doctor = Depends(get_current_doctor)):
    return {
        "name": doctor.name,
        "email": doctor.email
    }