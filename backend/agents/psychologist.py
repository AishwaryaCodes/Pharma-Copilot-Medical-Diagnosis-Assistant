# agents/psychologist.py

from langchain_core.prompts import PromptTemplate
from backend.agents.llm.hf_client import hf_generate
from backend.utils.faiss_memory import search_similar_cases

class Psychologist:
    def __init__(self, name: str, age: int, medical_report: str, llm):
        self.name = name
        self.age = age
        self.medical_report = medical_report
        self.llm = llm

    def run(self):
        try:
            similar_cases = search_similar_cases(self.medical_report, k=3)
            if similar_cases:
                similar_text = "\n".join([f"- {case}" for case in similar_cases])
            else:
                similar_text = "(No similar past cases found)"
        except Exception:
            similar_text = "(No similar past cases found)"
        
        prompt = PromptTemplate.from_template("""
            You are a licensed **clinical psychologist**.
            Patient Name: {name}
            Age: {age}
            Reported Symptoms: {medical_report}

            Similar past psychological cases:
            {similar_cases}

            === Task ===
            1. Analyze potential mental health concerns (e.g. anxiety, depression, trauma).
            2. Provide a psychological assessment.
            3. Suggest therapy options or next steps.

            Be thoughtful, precise, and empathetic in your response.
        """)
        
        formatted_prompt = prompt.format(
            name=self.name,
            age=self.age,
            medical_report=self.medical_report,
            similar_cases=similar_text
        )
        
        return hf_generate(formatted_prompt)