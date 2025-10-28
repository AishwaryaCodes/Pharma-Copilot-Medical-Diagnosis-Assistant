# backend/agents/team_diagnosis.py

from backend.agents.llm.hf_client import hf_generate
from langchain_core.prompts import PromptTemplate

class MultidisciplinaryTeam:
    def __init__(self, cardiologist: str, psychologist: str, pulmonologist: str, llm):
        self.cardiologist = cardiologist
        self.psychologist = psychologist
        self.pulmonologist = pulmonologist

    def run(self):
        prompt = PromptTemplate.from_template("""
            As a multidisciplinary panel of doctors, review the input from the three specialists and synthesize a final, concise medical summary for the patient.

            
            Cardiologist Report:
            {cardiologist}

            Psychologist Report:
            {psychologist}

            Pulmonologist Report:
            {pulmonologist}
            
            
            Task:
            1. Review all three expert reports.
            2. Provide a **final diagnosis summary** in plain English.
            3. Recommend next medical steps or referrals.

            Respond in 2-4 clear sentences. Be specific, use clinical reasoning, and avoid repeating the inputs.

        """)

        formatted_prompt = prompt.format(
            cardiologist=self.cardiologist,
            psychologist=self.psychologist,
            pulmonologist=self.pulmonologist
        )
        
        print("🧠 MultidisciplinaryTeam Prompt Sent:", formatted_prompt)
        return hf_generate(prompt=formatted_prompt)
