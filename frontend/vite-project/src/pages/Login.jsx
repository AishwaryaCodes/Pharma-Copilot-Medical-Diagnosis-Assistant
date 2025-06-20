import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";


const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:8000/login", formData);
      localStorage.setItem("token", res.data.access_token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed");
    }
  };

  return (
   <div className="flex min-h-screen">
  {/* Left Section - Branding */}
  <div className="w-1/2 bg-blue-600 text-white flex flex-col justify-center items-center px-6">
    <img
      src="/pharmaLogo.png"
      alt="Pharma Copilot"
      className="w-44 h-44 mb-6 rounded-full shadow-xl border-4 border-white bg-white object-contain"
    />
    <h1 className="text-4xl font-bold mb-2">Pharma Copilot</h1>
    <p className="text-lg font-light text-blue-100 max-w-md text-center">
      Your AI-powered medical diagnosis assistant built for doctors.
    </p>
  </div>

  {/* Right Section - Form */}
  <div className="w-1/2 bg-gray-50 flex justify-center items-center px-4">
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Login to Continue</h2>
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="w-full p-2 mb-3 border border-gray-300 rounded"
        required
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        className="w-full p-2 mb-4 border border-gray-300 rounded"
        required
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
      >
        Login
      </button>

      <p className="text-sm mt-4 text-center text-gray-600">
        Don’t have an account?{" "}
        <span
          onClick={() => navigate("/register")}
          className="text-blue-600 hover:underline cursor-pointer"
        >
          Create one
        </span>
      </p>
    </form>
  </div>
</div>

  );
};

export default Login;
