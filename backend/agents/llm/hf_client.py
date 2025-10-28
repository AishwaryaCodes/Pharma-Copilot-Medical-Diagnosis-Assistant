from dotenv import load_dotenv
load_dotenv()

import os
from huggingface_hub import InferenceClient

HF_TOKEN = os.getenv("HUGGINGFACEHUB_API_TOKEN")
HF_MODEL_ID = os.getenv("HF_MODEL_ID", "mistralai/Mistral-7B-Instruct-v0.2")

client = InferenceClient(model=HF_MODEL_ID, token=HF_TOKEN)

SYSTEM_MSG = "You are a concise, clinically careful medical assistant. Respond clearly and avoid speculation."

def hf_generate(prompt: str, max_tokens: int = 256, temperature: float = 0.7) -> str:
    """
    Chat-first (conversational) generation. If chat fails, try text_generation as a fallback.
    """
    # 1) Chat/completions (works for providers exposing 'conversational')
    try:
        resp = client.chat.completions.create(
            model=HF_MODEL_ID,
            messages=[
                {"role": "system", "content": SYSTEM_MSG},
                {"role": "user", "content": prompt},
            ],
            max_tokens=max_tokens,
            temperature=temperature,
        )
        return resp.choices[0].message.content.strip()
    except Exception as e_chat:
        # 2) Fallback to plain text_generation for providers that support it
        try:
            text = client.text_generation(
                prompt=prompt,
                max_new_tokens=max_tokens,
                temperature=temperature,
                top_p=0.9,
                repetition_penalty=1.05,
                stop=["</s>", "###", "User:", "Assistant:"],
            )
            return text.strip()
        except Exception as e_gen:
            return f"[LLM Error] chat={e_chat}; text_generation={e_gen}"
