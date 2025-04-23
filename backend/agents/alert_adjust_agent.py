# backend/agents/alert_adjust_agent.py

from backend.agents.base_agent import BaseAgent

class AlertAgent(BaseAgent):
    def __init__(self, llm):
        super().__init__(
            name="AlertAgent",
            description="You identify and generate alerts for potential drug interactions.",
            llm=llm
        )

    def generate_alerts(self, interactions):
        messages = []
        for item in interactions:
            if self.llm:
                messages.append(self.llm(
                    f"Check interaction between {item['drugA']} and {item['drugB']}. Risk: {item['risk']}. Return a warning if serious."
                ))
            else:
                messages.append(f"⚠️ {item['drugA']} and {item['drugB']} interaction. Risk level: {item['risk']}")
        return messages
