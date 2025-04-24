from langchain_core.prompts import PromptTemplate
from backend.agents.llm.hf_client import hf_generate  # ✅ use your huggingface generator

class Cardiologist():
    def __init__(self, name: str, age: int, medical_report: str, llm):
        self.name = name
        self.age = age
        self.medical_report = medical_report
        self.llm = llm


    def run(self):
        prompt = PromptTemplate.from_template("""
            You are a highly experienced **cardiologist**.
            Analyze the following patient report and identify any cardiac issues (e.g. chest pain, palpitations, shortness of breath, hypertension).
            
            Task:
            1. Identify potential cardiovascular conditions.
            2. Recommend any necessary diagnostic tests or follow-ups.

            Be specific in your diagnosis and recommend next steps or tests (e.g. ECG, echo, Holter).

            Patient Report:
            {medical_report}
        """)
        formatted = prompt.format(medical_report=self.medical_report)
        return hf_generate(formatted)
