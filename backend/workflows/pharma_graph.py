import os
import time
from dotenv import load_dotenv
from huggingface_hub import InferenceClient
from backend.models import Patient, Prescription

# Load environment variables
load_dotenv()
token = os.getenv("HUGGINGFACEHUB_API_TOKEN")
print("🔐 Loaded Token:", token)

# ✅ Hugging Face Model
MODEL_ID = "tiiuae/falcon-rw-1b"

try:
    client = InferenceClient(model=MODEL_ID, token=token)
except Exception as e:
    print(f"❌ Failed to load HF model: {e}")
    client = None

# 🧠 Call HF with retries
def hf_generate(prompt: str) -> str:
    for attempt in range(3):
        try:
            return client.text_generation(prompt=prompt, max_new_tokens=200)
        except Exception as e:
            print(f"⚠️ LLM call failed on attempt {attempt+1}: {e}")
            time.sleep(1)
    return f"⚠️ [Mocked] Failed response for: {prompt}"

# 🧩 Import Agents
from backend.agents.drug_scan_agent import DrugScanAgent
from backend.agents.research_agent import ResearchAgent
from backend.agents.dose_adjust_agent import DoseAdjustAgent
from backend.agents.alert_adjust_agent import AlertAgent
from backend.agents.explain_agent import ExplainAgent

# 🔧 Initialize agents
scan_agent = DrugScanAgent(llm=hf_generate)
research_agent = ResearchAgent(llm=hf_generate)
dose_agent = DoseAdjustAgent(llm=hf_generate)
alert_agent = AlertAgent(llm=hf_generate)
explain_agent = ExplainAgent(llm=hf_generate)

# 🔁 Main Graph Logic
def run_pharma_graph(prescription: Prescription):
    results = {}

    # 1. Drug Scan
    results["drug_scan"] = scan_agent.run(prescription)

    # 2. Research Insights
    results["research"] = [
        hf_generate(f"Provide research insight on {med}") for med in prescription.medications
    ]

    # 3. Dose Adjustments
    results["dose_adjustments"] = [
        dose_agent.suggest_adjustment(prescription.patient, med)
        for med in prescription.medications
    ]

    # 4. Alerts (Simulated)
    interactions = [
        {"drugA": "Ibuprofen", "drugB": "Aspirin", "risk": "High"},
        {"drugA": "Metformin", "drugB": "Lisinopril", "risk": "Moderate"},
    ]
    results["alerts"] = alert_agent.generate_alerts(interactions)

    # 5. Explanations
    results["explanations"] = [
        explain_agent.explain_interaction(interaction)
        for interaction in interactions
    ]

    print("✅ Final pharma graph results:", results)  # 🐞 Debug
    return results
