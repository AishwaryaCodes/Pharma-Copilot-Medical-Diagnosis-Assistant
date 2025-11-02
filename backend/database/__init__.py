# backend/database/__init__.py
from .database import Base, engine, SessionLocal, get_db
from . import models  # ensure models are imported so metadata is ready
