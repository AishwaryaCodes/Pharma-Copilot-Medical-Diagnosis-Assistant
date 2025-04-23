# backend/agents/explain_agent.py

from backend.agents.base_agent import BaseAgent

class ExplainAgent(BaseAgent):
    def __init__(self, llm):
        super().__init__(
            name="ExplainAgent",
            description="You explain medical drug interactions in simple terms.",
            llm=llm
        )

    def explain_interaction(self, interaction):
        if self.llm:
            return self.llm(
                f"Explain the interaction between {interaction['drugA']} and {interaction['drugB']} with {interaction['risk']} risk in simple medical terms."
            )
        else:
            return f"⚠️ {interaction['drugA']} and {interaction['drugB']} may interact. Risk: {interaction['risk']}."
