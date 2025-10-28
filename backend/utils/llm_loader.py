# utils/llm_loader.py

import os
from dotenv import load_dotenv
load_dotenv()
from huggingface_hub import InferenceClient



MODEL_ID = "mistralai/Mistral-7B-Instruct-v0.2"
TOKEN = os.getenv("HUGGINGFACEHUB_API_TOKEN")

def load_llm():
    if not TOKEN:
        raise ValueError("Missing Hugging Face API token. Please check your .env file.")

    try:
        print(" Loading Hugging Face model...")
        return InferenceClient(model=MODEL_ID, token=TOKEN)
    except Exception as e:
        print(f" Failed to initialize Hugging Face model: {e}")
        raise RuntimeError("Could not load the language model.")
