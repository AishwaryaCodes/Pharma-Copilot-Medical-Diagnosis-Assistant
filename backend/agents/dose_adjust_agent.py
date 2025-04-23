# backend/agents/dose_adjust_agent.py

from backend.agents.base_agent import BaseAgent
from backend.models import Patient

class DoseAdjustAgent(BaseAgent):
    def __init__(self, llm):
        super().__init__(
            name="DoseAdjustAgent",
            description="You suggest dose adjustments based on age and weight.",
            llm=llm
        )

    def suggest_adjustment(self, patient: Patient, medication: str) -> str:
        return self.llm(
            f"Suggest dose adjustment for {medication} based on patient age {patient.age} and weight {patient.weight}kg."
        )
