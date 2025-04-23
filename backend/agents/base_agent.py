# backend/agents/base_agent.py

class BaseAgent:
    def __init__(self, name: str, description: str, llm=None):
        self.name = name
        self.description = description
        self.llm = llm  # Should be a callable function like hf_generate(prompt)

    def run(self, input_text: str) -> str:
        if self.llm:
            try:
                return self.llm(input_text)
            except Exception as e:
                print(f"⚠️ LLM error: {e}")
                return f"⚠️ Mocked: Failed to respond for: {input_text}"
        else:
            return f"⚠️ Mocked response: {input_text}"
