// src/pages/Home.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import Header from "../components/Header";
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
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Require auth; if missing, send to login.
    if (!localStorage.getItem("token")) {
       toast.error("Please log in first.");
       navigate("/login");
      return;
     }
    setLoading(true);
    setResult(null);
    try {
      const res = await API.post("/diagnose", {
        name: formData.name,
        age: Number.isFinite(parseInt(formData.age, 10)) ? parseInt(formData.age, 10) : null,
        medical_report: formData.medical_report,
      });
      setResult(res.data);
      toast.success("Diagnosis completed successfully!");
    } catch (error) {
      if (error?.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
         localStorage.removeItem("token");
         navigate("/login");
        return;
       }
    }
    setLoading(false);
  };

  const toggleAccordion = (section) => {
    setExpanded(expanded === section ? null : section);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 py-8">
    <Header />
  
    <div className="flex flex-col lg:flex-row gap-10 mt-8 max-w-7xl mx-auto">
      {/* Left Section - Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-6 w-full lg:w-1/2"
      >
        <h2 className="text-xl font-semibold text-blue-800 mb-4 text-center">
          Enter Patient Details
        </h2>
  
        <label className="block mb-4">
          <span className="text-sm font-medium text-gray-800">Patient Name</span>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            required
          />
        </label>
  
        <label className="block mb-4">
          <span className="text-sm font-medium text-gray-800">Age</span>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            required
          />
        </label>
  
        <label className="block mb-4">
          <span className="text-sm font-medium text-gray-800">Medical Report</span>
          <textarea
            name="medical_report"
            value={formData.medical_report}
            onChange={handleChange}
            rows="4"
            className="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            required
          ></textarea>
        </label>
  
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-900 transition duration-200"
          disabled={loading}
        >
          {loading ? "Running Diagnosis..." : "Run AI Diagnosis"}
        </button>
      </form>
  
      {/* Right Section - Results or Placeholder */}
      <div className="w-full lg:w-1/2">
        {loading && !result ? (
          <div className="bg-white shadow-xl rounded-2xl p-6 h-full flex flex-col items-center justify-center text-blue-700 text-sm bg-blue-50">
            <p className="mb-4 font-medium text-center">Running diagnosis, please wait...</p>
            <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
          </div>
        ) : result && !result.error ? (
          <section className="bg-white shadow-xl rounded-2xl p-6 h-full">
            <h2 className="text-xl font-semibold text-blue-800 mb-4 text-center">
              Diagnosis Results
            </h2>
  
            {["cardiologist_result", "psychologist_result", "pulmonologist_result", "final_diagnosis"].map((key) => (
              <div
                key={key}
                className="mb-3 bg-blue-100 rounded-lg overflow-hidden shadow"
              >
                <button
                  onClick={() => toggleAccordion(key)}
                  className="w-full px-4 py-3 text-left font-semibold text-blue-900"
                >
                  {key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </button>
                {expanded === key && (
                  <div className="bg-white px-4 py-2 text-sm text-gray-800">
                    {result[key] || "No data available."}
                  </div>
                )}
              </div>
            ))}
  
            <div className="text-center mt-6">
              <button
                onClick={() => exportDiagnosisAsTxt(result)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
              >
                Download Copy
              </button>
            </div>
          </section>
        ) : (
          <div className="bg-white shadow-xl rounded-2xl p-6 h-full flex flex-col items-center justify-center text-blue-700 text-sm bg-blue-50">
            <p className="mb-3 font-medium text-center">
              Diagnosis results will appear here after submission.
            </p>
          </div>
        )}
      </div>
    </div>
  </main>
  );
}
