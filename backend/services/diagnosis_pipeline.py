# services/diagnosis_pipeline.py

# Import concurrent thread pool for running AI agents in parallel
from concurrent.futures import ThreadPoolExecutor

from backend.agents.cardiologist import Cardiologist
from backend.agents.psychologist import Psychologist
from backend.agents.pulmonologist import Pulmonologist
from backend.agents.team_diagnosis import MultidisciplinaryTeam

# Load the large language model (LLM) to be used by agents
from backend.utils.llm_loader import load_llm

# Initialize the LLM (from HuggingFace)
llm = load_llm()

def run_diagnosis_pipeline(name: str, age: int, medical_report: str) -> dict:
    print("Running Diagnosis Pipeline...")

    # Step 1: Initialize individual agents for each medical specialty
    # Each agent is given patient data + LLM for response generation
    agents = {
        "Cardiologist": Cardiologist(name, age, medical_report, llm),
        "Psychologist": Psychologist(name, age, medical_report, llm),
        "Pulmonologist": Pulmonologist(name, age, medical_report, llm),
    }

    # Dictionary to store output from each agent
    results = {}

    # Step 2: Execute all agents concurrently using ThreadPoolExecutor
    # This improves performance by running LLM calls in parallel threads
    with ThreadPoolExecutor() as executor:
        futures = {executor.submit(agent.run): name for name, agent in agents.items()}
        for future in futures:
            agent_name = futures[future]
            try:
                results[agent_name] = future.result()
            except Exception as e:
                results[agent_name] = f" Error: {str(e)}"

    # Step 3: Final team diagnosis – combines all specialist outputs
    team_agent = MultidisciplinaryTeam(
        cardiologist=results["Cardiologist"],
        psychologist=results["Psychologist"],
        pulmonologist=results["Pulmonologist"],
        llm=llm  # Also uses LLM to simulate team discussion
    )

    final_diagnosis = team_agent.run()

    # Final Output
    return {
        "name": name,
        "age": age,
        "cardiologist_result": results["Cardiologist"],
        "psychologist_result": results["Psychologist"],
        "pulmonologist_result": results["Pulmonologist"],
        "final_diagnosis": final_diagnosis
    }