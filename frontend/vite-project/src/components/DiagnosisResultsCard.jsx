// src/components/DiagnosisResultsCard.jsx

export default function DiagnosisResultsCard({ results }) {
  return (
    <section
      className="bg-gradient-to-b from-white to-blue-50 shadow-2xl rounded-2xl p-8 mt-8 w-full border border-blue-100"
      aria-label="Diagnosis Summary Section"
    >
      <h2 className="text-3xl font-bold text-blue-900 mb-8 text-center tracking-wide">
        🧾 Diagnosis Summary Report
      </h2>

      <div className="space-y-6 text-gray-800 text-[15px] leading-relaxed">
        <div>
          <h3 className="font-semibold text-blue-700 mb-1">🫀 Cardiologist Report</h3>
          <p className="bg-white/80 p-3 rounded-lg shadow-sm border border-blue-100">
            {results.cardiologist_result || "Awaiting cardiology analysis..."}
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-purple-700 mb-1">🧠 Psychologist Report</h3>
          <p className="bg-white/80 p-3 rounded-lg shadow-sm border border-purple-100">
            {results.psychologist_result || "Awaiting psychological analysis..."}
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-green-700 mb-1">🫁 Pulmonologist Report</h3>
          <p className="bg-white/80 p-3 rounded-lg shadow-sm border border-green-100">
            {results.pulmonologist_result || "Awaiting respiratory evaluation..."}
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-red-700 mb-1">🩺 Final Diagnosis</h3>
          <p className="bg-white/90 p-3 rounded-lg shadow-sm border border-red-200">
            {results.final_diagnosis || "Diagnosis being compiled..."}
          </p>
        </div>
      </div>
    </section>
  );
}
