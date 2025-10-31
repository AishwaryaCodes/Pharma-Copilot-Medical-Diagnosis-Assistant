# backend/database/__init__.py
from .database import Base, engine, SessionLocal
from .models import Doctor, Diagnosis

__all__ = ["Base", "engine", "SessionLocal", "Doctor", "Diagnosis"]
