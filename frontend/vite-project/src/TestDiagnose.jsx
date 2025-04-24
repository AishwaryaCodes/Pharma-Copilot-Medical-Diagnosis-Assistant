import { useState } from "react";

export default function TestDiagnose() {
  const [response, setResponse] = useState(null);

  const handleTest = async () => {
    const data = {
      name: "Test User",
      age: 45,
      medical_report: "shortness of breath and chest pain",
    };

    const res = await fetch("http://127.0.0.1:8000/diagnose", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    setResponse(result);
  };

  return (
    <div className="p-4">
      <button
        onClick={handleTest}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Run Test Diagnosis
      </button>

      {response && (
        <pre className="mt-4 bg-gray-100 p-4 rounded text-sm">
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
    </div>
  );
}
