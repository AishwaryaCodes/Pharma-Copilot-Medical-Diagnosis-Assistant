# backend/config/settings.py
import os
from dotenv import load_dotenv

load_dotenv()  # ⬅️ Load from .env

HUGGINGFACEHUB_API_TOKEN = os.getenv("HUGGINGFACEHUB_API_TOKEN")
