# services/diagnosis_pipeline.py

from concurrent.futures import ThreadPoolExecutor
from backend.agents.cardiologist import Cardiologist
from backend.agents.psychologist import Psychologist
from backend.agents.pulmonologist import Pulmonologist
from backend.agents.team_diagnosis import MultidisciplinaryTeam
from backend.utils.llm_loader import load_llm

llm = load_llm()

def run_diagnosis_pipeline(name: str, age: int, medical_report: str) -> dict:
    print("🚀 Running Diagnosis Pipeline...")

    # Step 1: Initialize agents
    agents = {
        "Cardiologist": Cardiologist(name, age, medical_report, llm),
        "Psychologist": Psychologist(name, age, medical_report, llm),
        "Pulmonologist": Pulmonologist(name, age, medical_report, llm),
    }

    results = {}

    # Step 2: Run all 3 agents concurrently
    with ThreadPoolExecutor() as executor:
        futures = {executor.submit(agent.run): name for name, agent in agents.items()}
        for future in futures:
            agent_name = futures[future]
            try:
                results[agent_name] = future.result()
            except Exception as e:
                results[agent_name] = f"❌ Error: {str(e)}"

    # Step 3: Final Diagnosis from Multidisciplinary Team
    team_agent = MultidisciplinaryTeam(
        cardiologist=results["Cardiologist"],
        psychologist=results["Psychologist"],
        pulmonologist=results["Pulmonologist"],
        llm=llm
    )

    final_diagnosis = team_agent.run()

    return {
        "name": name,
        "age": age,
        "cardiologist_result": results["Cardiologist"],
        "psychologist_result": results["Psychologist"],
        "pulmonologist_result": results["Pulmonologist"],
        "final_diagnosis": final_diagnosis
    }