# agents/pulmonologist.py

from langchain_core.prompts import PromptTemplate
from backend.utils.faiss_memory import search_similar_cases

class Pulmonologist:
    def __init__(self, name: str, age: int, medical_report: str, llm):
        self.name = name
        self.age = age
        self.medical_report = medical_report
        self.llm = llm
         
    def run(self):
        similar_cases = search_similar_cases(self.medical_report, k=3)
        similar_text = "\n".join([f"- {case}" for case in similar_cases])
        
        prompt = PromptTemplate.from_template("""
            You are a board-certified **pulmonologist**.
            
            dont include raw data like === Assistant === or  === Analysis ===

            Patient Name: {name}
            Age: {age}
            Current Report: {medical_report}

            Similar past respiratory cases:
            {similar_cases}

            === Task ===
            1. Identify any possible pulmonary conditions.
            2. Recommend treatment or further tests (e.g. chest x-ray, PFTs, CT scan).
            3. If the symptoms are unrelated to pulmonary issues, explain briefly.

            Keep it clinical, concise, and relevant.
        """)
        
        formatted = prompt.format(
            name=self.name,
            age=self.age,
            medical_report=self.medical_report,
            similar_cases=similar_text
        )
        
        return self.llm.text_generation(prompt=formatted)