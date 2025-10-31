// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../utils/api"; // ✅ shared axios client with token

export default function Profile() {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    specialization: "",
    hospital: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const { data } = await API.get("/me"); // ✅ token auto-attached
        setDoctor(data);
        setFormData({
          name: data.name || "",
          email: data.email || "",
          specialization: data.specialization || "",
          hospital: data.hospital || "",
        });
      } catch (err) {
        console.error("Failed to load profile", err);
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
      }
    })();
  }, [navigate]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async () => {
    try {
      // PUT to /me (or /update_profile if you keep that path)
      const { data } = await API.put("/me", {
        name: formData.name,
        specialization: formData.specialization || null,
        hospital: formData.hospital || null,
      });
      setDoctor(data);
      toast.success("Profile updated successfully!");
      setEditing(false);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.detail || "Failed to update profile.";
      toast.error(msg);
    }
  };

  if (!doctor)
    return <div className="flex h-screen items-center justify-center">Loading...</div>;

  return (
    <main className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-slate-800">👨‍⚕️ Doctor Profile</h1>
          <button
            onClick={() => setEditing(!editing)}
            className={`px-4 py-2 rounded-lg text-white ${
              editing ? "bg-gray-600" : "bg-blue-600 hover:bg-blue-700"
            }`}
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
          {/* created_at might not exist in your Doctor model; safe fallback */}
          <p>
            <strong>Member since:</strong>{" "}
            {doctor.created_at ? new Date(doctor.created_at).toLocaleDateString() : "N/A"}
          </p>
          <p>
            <strong>Doctor ID:</strong> {doctor.id}
          </p>
        </div>
      </div>
    </main>
  );
}
