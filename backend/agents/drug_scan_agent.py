# backend/agents/drug_scan_agent.py

from backend.agents.base_agent import BaseAgent

class DrugScanAgent(BaseAgent):
    def __init__(self, llm):
        super().__init__(
            name="DrugScanAgent",
            description="You are a medication safety assistant. Check patient prescriptions for any common dangerous drugs or blackbox warnings.",
            llm=llm
        )

    def run(self, prescription) -> dict:
        alerts = []
        for med in prescription.medications:
            response = self.llm(f"Check for dangerous drug interactions or blackbox warnings for: {med}")
            alerts.append(response)
        return {"alerts": alerts}
