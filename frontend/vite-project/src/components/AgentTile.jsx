import { useState } from "react";

export default function AgentTile({ title, endpoint, placeholder, buttonLabel = "Run" }) {
  const [input, setInput] = useState("");
  const [out, setOut] = useState(null);
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    setOut(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8000${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ context: input }),
      });
      setOut(await res.json());
    } catch (e) {
      setOut({ error: "Service unavailable" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm border">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <textarea
        className="w-full border rounded-lg px-3 py-2 mb-3"
        rows={3}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholder}
      />
      <button
        onClick={run}
        disabled={loading}
        className="px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-60"
      >
        {loading ? "Working…" : buttonLabel}
      </button>

      {out && (
        <pre className="mt-3 bg-slate-50 p-3 rounded-lg text-sm whitespace-pre-wrap overflow-auto max-h-48">
          {JSON.stringify(out, null, 2)}
        </pre>
      )}
    </div>
  );
}
