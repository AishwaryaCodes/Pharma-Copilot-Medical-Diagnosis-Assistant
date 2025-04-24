// src/pages/Home.jsx
import { useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import { TbReportSearch } from "react-icons/tb";
import { MdOutlineFileDownload } from "react-icons/md";
import toast from "react-hot-toast";
import { exportDiagnosisAsTxt } from "../utils/exportToTxt";

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    medical_report: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.post("http://127.0.0.1:8000/diagnose", {
        name: formData.name,
        age: parseInt(formData.age),
        medical_report: formData.medical_report,
      });
      setResult(res.data);
      toast.success("Diagnosis completed successfully!");
    } catch (error) {
      console.error("Diagnosis failed:", error);
      setResult({ error: "Diagnosis failed. Please try again." });
      toast.error("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const toggleAccordion = (section) => {
    setExpanded(expanded === section ? null : section);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col items-center px-6 py-10">
      <Header />

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-2xl space-y-6 mt-10"
        aria-label="Health Diagnosis Form"
      >
        <h2 className="text-xl font-semibold text-blue-800 mb-2 text-center">
          Enter Patient Details
        </h2>

        <label className="block">
          <span className="text-sm font-medium text-gray-800">
            Patient Name
          </span>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            aria-required="true"
            aria-label="Patient Name"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-800">Age</span>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2  rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            aria-required="true"
            aria-label="Patient Age"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-800">
            Medical Report
          </span>
          <textarea
            name="medical_report"
            value={formData.medical_report}
            onChange={handleChange}
            rows="4"
            className="mt-1 block w-full px-4 py-2  rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            aria-required="true"
            aria-label="Medical Report"
          ></textarea>
        </label>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold py-2 rounded-lg hover:from-blue-700 hover:to-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? (
            "Running Diagnosis..."
          ) : (
            <>
              Run AI Diagnosis{" "}
              <TbReportSearch className="inline-block ml-2 text-lg" />
            </>
          )}
        </button>
      </form>

      {result && !result.error && (
        <section className="mt-10 w-full max-w-4xl">
          <h2 className="text-2xl font-semibold text-center text-blue-900 mb-6">
            Diagnosis Results
          </h2>

          {[
            "cardiologist_result",
            "psychologist_result",
            "pulmonologist_result",
            "final_diagnosis",
          ].map((key) => (
            <div
              key={key}
              className="mb-4 border border-gray-300 rounded-lg shadow-sm"
            >
              <button
                onClick={() => toggleAccordion(key)}
                className="w-full text-left px-4 py-3 bg-blue-100 hover:bg-blue-200 rounded-t-lg font-medium text-blue-900 focus:outline-none"
              >
                {key
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase())}
              </button>
              {expanded === key && (
                <div className="px-4 py-3 text-sm text-gray-800 bg-white rounded-b-lg">
                  {result[key] || "No data available."}
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {result?.error && (
        <div className="mt-6 text-red-600 text-sm font-semibold">
          {result.error}
        </div>
      )}

      {result && !result.error && (
        <div className="text-center mt-4">
          <button
            onClick={() => exportDiagnosisAsTxt(result)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition"
          >
            Download Copy <MdOutlineFileDownload />
          </button>
        </div>
      )}
    </main>
  );
}
