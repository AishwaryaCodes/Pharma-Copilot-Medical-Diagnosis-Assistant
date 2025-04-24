# agents/pulmonologist.py

from langchain_core.prompts import PromptTemplate

class Pulmonologist:
    def __init__(self, name: str, age: int, medical_report: str, llm):
        self.name = name
        self.age = age
        self.medical_report = medical_report
        self.llm = llm
         
    def run(self):
        prompt = PromptTemplate.from_template("""
            You are a board-certified **pulmonologist**.
            Evaluate the patient's report for respiratory issues (e.g. shortness of breath, coughing, wheezing, asthma, smoking history).

            Provide a concise respiratory diagnosis and treatment path.

            Patient Report:
            {medical_report}
        """)
        formatted = prompt.format(medical_report=self.medical_report)
        return self.llm.text_generation(prompt=formatted)