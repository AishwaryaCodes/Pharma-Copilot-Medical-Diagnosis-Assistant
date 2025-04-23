import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Report() {
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const stored = localStorage.getItem("analysisResult");
      const parsed = stored ? JSON.parse(stored) : null;
      setResult(parsed);
      console.log("🧠 Loaded result in /report:", parsed);
    } catch (err) {
      console.error("❌ Failed to parse localStorage:", err);
    }
  }, []);

  if (!result) {
    return (
      <div className="text-center mt-20 text-red-600">
        ❌ No analysis data found. Please submit the form first.
        <br />
        <button
          onClick={() => navigate("/")}
          className="mt-4 text-blue-600 underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  const { patient, medications, analysis } = result;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">💊 Drug Interaction Report</h2>

      <div>
        <h3 className="font-semibold">👤 Patient Details:</h3>
        <p><strong>Name:</strong> {patient?.name}</p>
        <p><strong>Age:</strong> {patient?.age}</p>
        <p><strong>Weight:</strong> {patient?.weight} kg</p>
      </div>

      <div>
        <h3 className="font-semibold">💊 Medications:</h3>
        <ul className="list-disc list-inside text-gray-700">
          {medications?.map((med, index) => (
            <li key={index}>{med}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-semibold">🔍 Drug Scan:</h3>
        {analysis?.drug_scan?.length > 0 ? (
          analysis.drug_scan.map((alert, index) => (
            <p key={index} className="text-yellow-600">⚠️ {alert}</p>
          ))
        ) : (
          <p>❌ No scan data available.</p>
        )}
      </div>

      <div>
        <h3 className="font-semibold">📐 Dose Adjustments:</h3>
        {analysis?.dose_adjustments?.length > 0 ? (
          analysis.dose_adjustments.map((item, index) => (
            <p key={index} className="text-yellow-600">⚠️ {item}</p>
          ))
        ) : (
          <p>❌ No suggestions available.</p>
        )}
      </div>

      <div>
        <h3 className="font-semibold">🚨 Alerts:</h3>
        {analysis?.alerts?.length > 0 ? (
          analysis.alerts.map((alert, index) => (
            <p key={index} className="text-yellow-600">⚠️ {alert}</p>
          ))
        ) : (
          <p>❌ No alerts.</p>
        )}
      </div>

      <div>
        <h3 className="font-semibold">🧠 Explanations:</h3>
        {analysis?.explanations?.length > 0 ? (
          analysis.explanations.map((exp, index) => (
            <p key={index} className="text-yellow-600">⚠️ {exp}</p>
          ))
        ) : (
          <p>❌ No explanations.</p>
        )}
      </div>

      <div>
        <h3 className="font-semibold">📚 Research Summaries:</h3>
        {analysis?.research?.length > 0 ? (
          analysis.research.map((summary, index) => (
            <p key={index}>{summary}</p>
          ))
        ) : (
          <p>❌ No research found.</p>
        )}
      </div>

      <button
        onClick={() => {
          localStorage.removeItem("analysisResult");
          navigate("/");
        }}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        🔙 Back to Form
      </button>
    </div>
  );
}
