import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../utils/api"; // ✅ shared axios client

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    // Optional fields (your DB allows them to be null):
    specialization: "",
    hospital: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // ✅ Register (keep optional fields if filled)
      await API.post("/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        specialization: formData.specialization || null,
        hospital: formData.hospital || null,
      });

      // ✅ Auto-login after register
      const { data } = await API.post("/login", {
        email: formData.email,
        password: formData.password,
      });

      if (!data?.access_token) throw new Error("No token received");
      localStorage.setItem("token", data.access_token);
      toast.success("Account created!");
      navigate("/dashboard");
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Registration failed";
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left: Branding */}
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

      {/* Right: Form */}
      <div className="w-1/2 bg-gray-50 flex justify-center items-center px-4">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-4 text-center">Create Account</h2>
          {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 mb-3 border border-gray-300 rounded"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 mb-3 border border-gray-300 rounded"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-2 mb-3 border border-gray-300 rounded"
          />

          {/* Optional fields (safe to leave blank) */}
          <input
            type="text"
            name="specialization"
            placeholder="Specialization (optional)"
            value={formData.specialization}
            onChange={handleChange}
            className="w-full p-2 mb-3 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="hospital"
            placeholder="Hospital (optional)"
            value={formData.hospital}
            onChange={handleChange}
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />

          <button type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">
            Register
          </button>

          <p className="text-center text-sm mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
