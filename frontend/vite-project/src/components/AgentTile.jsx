// src/components/AgentTile.jsx
import React, { useState } from "react";
import toast from "react-hot-toast";
import API from "../utils/api"; // ✅ use the shared client with token

export default function AgentTile({
  title,
  endpoint,              // e.g. "/agent/icd10" or "/agent/followup"
  placeholder = "",
  buttonLabel = "Run",
}) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const runAgent = async () => {
    if (!input.trim()) return toast.error("Please paste a prompt or report.");
    setLoading(true);
    setResult("");

    try {
      // post to your backend route with the shared API instance
      const res = await API.post(endpoint, { text: input }); 
      // ^ tweak payload shape if your backend expects different keys

      // normalize possible response shapes
      const data = res.data;
      setResult(
        data?.result || data?.text || data?.output || JSON.stringify(data, null, 2)
      );
      toast.success("Done!");
    } catch (err) {
      console.error(err);
      const detail = err?.response?.data?.detail || err.message || "Agent error";
      toast.error(detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm border">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>

      <textarea
        className="w-full border rounded-lg p-3 min-h-[110px]"
        placeholder={placeholder}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={runAgent}
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? "Running…" : buttonLabel}
        </button>
      </div>

      {result && (
        <pre className="mt-4 bg-slate-50 rounded-lg p-3 text-sm overflow-auto max-h-60">
{result}
        </pre>
      )}
    </div>
  );
}
