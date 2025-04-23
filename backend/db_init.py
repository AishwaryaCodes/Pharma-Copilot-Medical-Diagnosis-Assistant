from database.db import Base, engine
from database.models import Patient, Medication

print("Creating database tables...")
Base.metadata.create_all(bind=engine)
