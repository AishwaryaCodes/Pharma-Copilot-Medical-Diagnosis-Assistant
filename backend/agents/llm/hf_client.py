# llm/hf_client.py

from huggingface_hub import InferenceClient
import os

token = os.getenv("HUGGINGFACEHUB_API_TOKEN")
client = InferenceClient(model="HuggingFaceH4/zephyr-7b-beta", token=token)

def hf_generate(prompt: str) -> str:    
    try:
        response = client.text_generation(prompt=prompt, max_new_tokens=200)
        print(" Hugging Face Response:", response)
        return response
    except Exception as e:
        return f"[Mocked] Error occurred: {e}"
