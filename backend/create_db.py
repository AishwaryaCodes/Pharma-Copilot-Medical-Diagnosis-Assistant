# backend/create_db.py

from database.database import engine
from database.models import Base

print("🔧 Creating database tables...")
Base.metadata.create_all(bind=engine)
print("✅ Tables created successfully.")
