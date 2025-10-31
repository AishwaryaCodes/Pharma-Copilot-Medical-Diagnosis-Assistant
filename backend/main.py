# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from backend.database import Base, engine, models  # <-- uses your __init__.py imports
from backend.routes import diagnosis, history, auth, dashboard


# 🧩 Step 1: ensure the doctors table has all columns (adds specialization/hospital if missing)
def _ensure_doctor_columns():
    """SQLite-only: add new columns if the DB was created before we added them."""
    with engine.begin() as conn:
        # get existing columns
        cols = [row[1] for row in conn.exec_driver_sql("PRAGMA table_info(doctors)")]
        if "specialization" not in cols:
            print("⚙️  Adding column doctors.specialization ...")
            conn.exec_driver_sql("ALTER TABLE doctors ADD COLUMN specialization VARCHAR")
        if "hospital" not in cols:
            print("⚙️  Adding column doctors.hospital ...")
            conn.exec_driver_sql("ALTER TABLE doctors ADD COLUMN hospital VARCHAR")


#  Step 2: create tables + patch old DB schema
Base.metadata.create_all(bind=engine)
_ensure_doctor_columns()
print("✅ Database and tables created!")


# Step 3: start FastAPI app
app = FastAPI(
    title="MediAI Diagnostics",
    description="A full-stack agentic AI system for multi-specialist diagnosis",
    version="1.0",
)


@app.get("/")
def read_root():
    return {"message": "Pharma Copilot Backend is running"}


# Step 4: enable CORS for local frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Step 5: register routes
app.include_router(auth.router)
app.include_router(diagnosis.router)
app.include_router(history.router)
app.include_router(dashboard.router)
