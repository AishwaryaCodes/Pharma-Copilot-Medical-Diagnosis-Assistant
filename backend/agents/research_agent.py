# backend/agents/research_agent.py

from backend.agents.base_agent import BaseAgent

class ResearchAgent(BaseAgent):
    def __init__(self, llm):
        super().__init__(
            name="ResearchAgent",
            description="You provide latest clinical research and findings related to medications.",
            llm=llm
        )

    def fetch_research(self, medication: str) -> str:
        return self.llm(f"Provide research insight on {medication}")
