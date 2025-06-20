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
        try:
            similar_cases = search_similar_cases(self.medical_report, k=3)
        except Exception:
            similar_cases = []

        if similar_cases:
            similar_text = "\n".join([f"- {case}" for case in similar_cases])
            similar_section = f"\nSimilar past cases:\n{similar_text}"
        else:
            similar_section = "\n(No similar past cases found)"

        prompt = PromptTemplate.from_template("""
            You are a highly experienced **cardiologist**.

            Don't include raw data like === Assistant === or === Analysis ===

            Analyze the following patient report:

            Patient Name: {name}
            Age: {age}
            Current Report: {medical_report}
            {similar_section}

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
            similar_section=similar_section
        )

        return hf_generate(formatted)