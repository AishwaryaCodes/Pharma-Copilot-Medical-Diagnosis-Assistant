
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.database.db import Base, engine
from backend.routes import analysis  # We'll create this next

# Auto-create all DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI()
# Include all routes
app.include_router(analysis.router)

# Allow frontend to connect (from localhost:5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




