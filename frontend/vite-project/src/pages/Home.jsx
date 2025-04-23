// frontend/src/pages/Home.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Home() {
  const [patient, setPatient] = useState({ name: "", age: "", weight: "" });
  const [medications, setMedications] = useState([""]);
  const navigate = useNavigate();

  const handlePatientChange = (e) => {
    setPatient({ ...patient, [e.target.name]: e.target.value });
  };

  const handleMedicationChange = (index, value) => {
    const updated = [...medications];
    updated[index] = value;
    setMedications(updated);
  };

  const addMedication = () => setMedications([...medications, ""]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:8000/analysis", {
        patient,
        medications,
      });
      localStorage.setItem("analysisResult", JSON.stringify(res.data));
      navigate("/report");
    } catch (err) {
      console.error("❌ Submission failed:", err);
      alert("Backend error occurred. Check console and try again.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800">Pharma Copilot 💊</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-gray-600">Patient Name</label>
          <input
            name="name"
            value={patient.name}
            onChange={handlePatientChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block mb-1 text-gray-600">Age</label>
            <input
              type="number"
              name="age"
              value={patient.age}
              onChange={handlePatientChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block mb-1 text-gray-600">Weight (kg)</label>
            <input
              type="number"
              name="weight"
              value={patient.weight}
              onChange={handlePatientChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 text-gray-600">Medications</label>
          {medications.map((med, index) => (
            <input
              key={index}
              type="text"
              value={med}
              onChange={(e) => handleMedicationChange(index, e.target.value)}
              className="w-full mb-2 px-3 py-2 border rounded"
              placeholder={`Medication ${index + 1}`}
              required
            />
          ))}
          <button
            type="button"
            onClick={addMedication}
            className="text-blue-600 hover:underline mt-1"
          >
            + Add Another
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Analyze Interaction
        </button>
      </form>
    </div>
  );
}
