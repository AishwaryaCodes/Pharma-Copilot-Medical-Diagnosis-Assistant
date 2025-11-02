# backend/main.py
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.database import Base, engine
from backend.database.database import is_sqlite
from backend.routes import diagnosis, history, auth, dashboard

# --- Create tables ---
Base.metadata.create_all(bind=engine)

# --- SQLite-only: patch legacy DBs that predate specialization/hospital ---
def _ensure_doctor_columns_sqlite():
    if not is_sqlite:
        return
    with engine.begin() as conn:
        cols = [row[1] for row in conn.exec_driver_sql("PRAGMA table_info(doctors)")]
        if "specialization" not in cols:
            print("⚙️  Adding column doctors.specialization ...")
            conn.exec_driver_sql("ALTER TABLE doctors ADD COLUMN specialization VARCHAR")
        if "hospital" not in cols:
            print("⚙️  Adding column doctors.hospital ...")
            conn.exec_driver_sql("ALTER TABLE doctors ADD COLUMN hospital VARCHAR")

_ensure_doctor_columns_sqlite()
print("✅ Database and tables created!")

app = FastAPI(
    title="MediAI Diagnostics",
    description="A full-stack agentic AI system for multi-specialist diagnosis",
    version="1.0",
)

@app.get("/")
def read_root():
    return {"message": "Pharma Copilot Backend is running"}

# --- CORS ---
FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_ORIGIN, "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Routes ---
app.include_router(auth.router)
app.include_router(diagnosis.router)
app.include_router(history.router)
app.include_router(dashboard.router)
