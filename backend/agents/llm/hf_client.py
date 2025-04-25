# llm/hf_client.py

from huggingface_hub import InferenceClient
import os

token = os.getenv("HUGGINGFACEHUB_API_TOKEN")
client = InferenceClient(model="HuggingFaceH4/zephyr-7b-beta", token=token)

def hf_generate(prompt: str) -> str:    
    try:
        response = client.text_generation(prompt=prompt, max_new_tokens=200)
        print(" Hugging Face Response:", response)
        
        
        if response.strip().startswith(("=== Assistant ===", "=== Analysis ===")):
            response = response.strip()
        
        for prefix in ("=== Assistant ===", "=== Analysis ==="):
            if response.startswith(prefix):
                response = response.replace(prefix, "", 1).strip()
            
        return response
    except Exception as e:
        return f"[Mocked] Error occurred: {e}"
