from langchain_core.prompts import PromptTemplate
from backend.agents.llm.hf_client import hf_generate
from backend.utils.faiss_memory import search_similar_cases  

class Cardiologist():
    def __init__(self, name: str, age: int, medical_report: str, llm):
        self.name = name
        self.age = age
        self.medical_report = medical_report
        self.llm = llm


    def run(self):  
        similar_cases = search_similar_cases(self.medical_report, k=3)
        similar_text = "\n".join([f"- {case}" for case in similar_cases])
        
        prompt = PromptTemplate.from_template("""
            You are a highly experienced **cardiologist**.
            
            Analyze the following patient report 
            
            Patient Name: {name}
            Age: {age}
            Current Report: {medical_report}

            Similar past cases:
            {similar_cases}

            === Task ===
            1. Determine if the report contains any cardiovascular conditions.
            2. Suggest appropriate tests or referrals.
            3. If unrelated to cardiology, explain briefly.

            Give a medically sound, clear, and specific response.
        """)
        
        formatted = prompt.format(
            name=self.name,
            age=self.age,
            medical_report=self.medical_report,
            similar_cases=similar_text
            )
        
        return hf_generate(formatted)
