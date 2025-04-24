# agents/psychologist.py

from langchain_core.prompts import PromptTemplate
from backend.agents.llm.hf_client import hf_generate

class Psychologist:
    def __init__(self, name: str, age: int, medical_report: str, llm):
        self.name = name
        self.age = age
        self.medical_report = medical_report
        self.llm = llm


    def run(self):
        prompt = PromptTemplate.from_template("""
            You are a licensed **clinical psychologist**.
            Analyze the patient's symptoms and determine if there are any signs of mental health issues like depression, anxiety, or trauma.

            Provide a psychological assessment and clear therapy recommendations.

            Patient Report:
            {medical_report}
        """)
        formatted_prompt = prompt.format(medical_report=self.medical_report)
        return hf_generate(formatted_prompt)
