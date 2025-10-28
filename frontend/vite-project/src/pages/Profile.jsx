// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const API = "http://localhost:8000"; // adjust if needed

export default function Profile() {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", specialization: "", hospital: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const res = await axios.get(`${API}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDoctor(res.data);
        setFormData({
          name: res.data.name || "",
          email: res.data.email || "",
          specialization: res.data.specialization || "",
          hospital: res.data.hospital || "",
        });
      } catch (error) {
        console.error("Failed to load profile", error);
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API}/update_profile`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Profile updated successfully!");
      setEditing(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile.");
    }
  };

  if (!doctor) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  return (
    <main className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-slate-800">👨‍⚕️ Doctor Profile</h1>
          <button
            onClick={() => setEditing(!editing)}
            className={`px-4 py-2 rounded-lg text-white ${editing ? "bg-gray-600" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {editing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              disabled={!editing}
              onChange={handleChange}
              className={`mt-1 w-full border rounded-lg px-3 py-2 ${
                editing ? "bg-white" : "bg-slate-100"
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              className="mt-1 w-full border rounded-lg px-3 py-2 bg-slate-100 text-slate-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Specialization</label>
            <input
              type="text"
              name="specialization"
              value={formData.specialization}
              disabled={!editing}
              onChange={handleChange}
              placeholder="e.g., Cardiology, Pulmonology"
              className={`mt-1 w-full border rounded-lg px-3 py-2 ${
                editing ? "bg-white" : "bg-slate-100"
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Hospital / Clinic</label>
            <input
              type="text"
              name="hospital"
              value={formData.hospital}
              disabled={!editing}
              onChange={handleChange}
              placeholder="e.g., City General Hospital"
              className={`mt-1 w-full border rounded-lg px-3 py-2 ${
                editing ? "bg-white" : "bg-slate-100"
              }`}
            />
          </div>
        </div>

        {editing && (
          <div className="mt-6 text-right">
            <button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              Save Changes
            </button>
          </div>
        )}

        <hr className="my-6" />

        <div className="text-sm text-slate-500">
          <p><strong>Member since:</strong> {doctor.created_at ? new Date(doctor.created_at).toLocaleDateString() : "N/A"}</p>
          <p><strong>Doctor ID:</strong> {doctor.id}</p>
        </div>
      </div>
    </main>
  );
}
