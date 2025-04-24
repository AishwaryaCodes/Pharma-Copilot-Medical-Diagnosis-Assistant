# backend/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.database.database import Base, engine
from backend.database.models import PatientReport
from backend.database import models
from backend.routes import diagnosis
from backend.routes import history

# Create tables
Base.metadata.create_all(bind=engine)
print("✅ Database and tables created!")

app = FastAPI(
    title="MediAI Diagnostics",
    description="A full-stack agentic AI system for multi-specialist diagnosis",
    version="1.0"
)

# CORS Middleware for frontend (React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include diagnosis route
app.include_router(diagnosis.router)


app.include_router(history.router)

