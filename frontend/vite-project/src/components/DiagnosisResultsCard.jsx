// src/components/DiagnosisResultsCard.jsx

export default function DiagnosisResultsCard({ results }) {
    return (
      <section
        className="bg-white shadow-xl rounded-2xl p-8 mt-8 w-full"
        aria-label="Diagnosis Summary Section"
      >
        <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">
          Diagnosis Results
        </h2>
  
        <div className="space-y-6 text-gray-800 text-sm leading-relaxed">
          <div>
            <h3 className="font-semibold text-blue-700">🫀 Cardiologist Report</h3>
            <p>{results.cardiologist_result || "Awaiting cardiology analysis..."}</p>
          </div>
  
          <div>
            <h3 className="font-semibold text-purple-700">🧠 Psychologist Report</h3>
            <p>{results.psychologist_result || "Awaiting psychological analysis..."}</p>
          </div>
  
          <div>
            <h3 className="font-semibold text-green-700">🫁 Pulmonologist Report</h3>
            <p>{results.pulmonologist_result || "Awaiting respiratory evaluation..."}</p>
          </div>
  
          <div>
            <h3 className="font-semibold text-red-700">🩺 Final Diagnosis</h3>
            <p>{results.final_diagnosis || "Diagnosis being compiled..."}</p>
          </div>
        </div>
      </section>
    );
  }
  