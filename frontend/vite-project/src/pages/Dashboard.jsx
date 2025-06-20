// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const res = await axios.get("http://localhost:8000/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDoctor(res.data);
      } catch (err) {
        setError("Unauthorized or session expired.");
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchDoctor();
  }, [navigate]);

  const goToAddPatient = () => navigate("/diagnose");
  const goToHistory = () => navigate("/history");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome to Dashboard</h1>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        {doctor ? (
          <div>
            <p className="text-lg mb-2">👨‍⚕️ Dr. {doctor.name}</p>
            <p className="text-sm text-gray-600 mb-6">📧 {doctor.email}</p>

            <button
              onClick={goToAddPatient}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg mb-3 w-full hover:bg-blue-700"
            >
              ➕ Add New Patient Diagnosis
            </button>

            <button
              onClick={goToHistory}
              className="bg-green-600 text-white px-4 py-2 rounded-lg w-full hover:bg-green-700"
            >
              📋 View Diagnosis History
            </button>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
