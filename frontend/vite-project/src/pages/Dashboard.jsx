// src/pages/Dashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AgentTile from "../components/AgentTile";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const API = "http://localhost:8000"; // adjust if needed

function Card({ children, className = "" }) {
  return (
    <div className={`rounded-2xl bg-white p-5 shadow-sm border ${className}`}>
      {children}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <Card>
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-2 text-2xl font-semibold">{value ?? "—"}</div>
    </Card>
  );
}

function Badge({ kind = "ok", children }) {
  const map = {
    ok: "bg-green-50 text-green-700 border-green-200",
    warn: "bg-yellow-50 text-yellow-700 border-yellow-200",
    error: "bg-red-50 text-red-700 border-red-200",
  };
  return (
    <span className={`text-xs px-2 py-1 rounded-full border ${map[kind]}`}>{children}</span>
  );
}

export default function Dashboard() {
  const nav = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState(null);
  const [loading, setLoading] = useState(true);

  const client = useMemo(() => {
    const token = localStorage.getItem("token");
    return axios.create({
      baseURL: API,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!localStorage.getItem("token")) return nav("/login");

        const [meRes, statsRes, recentRes] = await Promise.allSettled([
          client.get("/me"),
          client.get("/stats/overview"),                       // optional (has fallback below)
          client.get("/reports", { params: { limit: 5 } }),    // change to your history endpoint if different
        ]);

        if (meRes.status === "fulfilled" && mounted) setDoctor(meRes.value.data);
        if (statsRes.status === "fulfilled" && mounted) setStats(statsRes.value.data);

        if (recentRes.status === "fulfilled" && mounted) {
          const items = (recentRes.value.data?.items || recentRes.value.data || []).map((r) => ({
            id: r.id,
            name: r.name,
            age: r.age,
            final: r.final_diagnosis || r.final || r.diagnosis || "",
            created_at: r.created_at || null,
            hadError:
              (r.cardiologist_result && String(r.cardiologist_result).startsWith("[LLM Error]")) ||
              (r.psychologist_result && String(r.psychologist_result).startsWith("[LLM Error]")) ||
              (r.pulmonologist_result && String(r.pulmonologist_result).startsWith("[LLM Error]")) ||
              (r.final_diagnosis && String(r.final_diagnosis).startsWith("[LLM Error]")),
          }));
          setRecent(items);
        }
      } catch (e) {
        console.error(e);
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("token");
        nav("/login");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, [client, nav]);

  // Fallback stats when /stats/overview not implemented
  const computedStats = useMemo(() => {
    if (stats) return stats;
    if (!recent) return null;
    return {
      patients_7d: recent.length,
      avg_turnaround_seconds: 8.5,
      llm_success_rate:
        recent.length === 0 ? 1 : recent.filter((r) => !r.hadError).length / recent.length,
      saved_reports: recent.length,
    };
  }, [stats, recent]);

  // ----- MOCK chart data: replace with backend later
  const trendData = [
    { week: "W1", patients: 3, success: 0.9 },
    { week: "W2", patients: 5, success: 0.95 },
    { week: "W3", patients: 4, success: 0.92 },
    { week: "W4", patients: 7, success: 0.97 },
  ];

  const onNew = () => nav("/diagnose");
  const onHistory = () => nav("/history");

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
        {/* Welcome + primary CTA */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold">
              {doctor ? `Welcome back, Dr. ${doctor.name}!` : "Welcome back"}
            </h1>
            <p className="text-slate-500 text-sm">{doctor?.email ?? "Loading profile…"}</p>
          </div>
          <button
            onClick={onNew}
            className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-700"
          >
            ➕ New Diagnosis
          </button>
        </div>

        {/* Top row: KPIs + Doctor snapshot */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-2xl bg-slate-200" />
            ))}
          </div>
        ) : (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <Stat label="Patients (7d)" value={computedStats?.patients_7d} />
            <Stat
              label="Avg. AI Turnaround"
              value={
                computedStats
                  ? `${computedStats.avg_turnaround_seconds?.toFixed?.(1) ?? "—"}s`
                  : "—"
              }
            />
            <Stat
              label="LLM Success"
              value={
                computedStats ? `${Math.round((computedStats.llm_success_rate ?? 0) * 100)}%` : "—"
              }
            />
            <Stat label="Saved Reports" value={computedStats?.saved_reports} />

            {/* 👨‍⚕️ Doctor Snapshot */}
            <Card>
              <div className="flex items-center gap-3">
                <img
                  src="/default-avatar.png"
                  alt="Doctor Avatar"
                  className="w-12 h-12 rounded-full border"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
                <div className="min-w-0">
                  <p className="font-semibold truncate">Dr. {doctor?.name ?? "—"}</p>
                  <p className="text-sm text-gray-500 truncate">
                    {doctor?.specialization || "General Practitioner"}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {doctor?.hospital || "—"}
                  </p>
                </div>
              </div>
            </Card>
          </section>
        )}

        {/* Middle row: Quick Actions + Recent + Trends */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card>
            <h3 className="text-lg font-semibold">Quick Actions</h3>
            <p className="text-slate-500 text-sm mt-1">Start a diagnosis or add a report.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={onNew}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700"
              >
                ➕ New Diagnosis
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200"
                onClick={() => toast("Paste area coming soon")}
              >
                📄 Paste Report
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200"
                onClick={() => toast("Upload coming soon")}
              >
                🖼️ Upload Report
              </button>
            </div>
          </Card>

          {/* Recent Diagnoses */}
          <Card className="lg:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Recent Diagnoses</h3>
              <button onClick={onHistory} className="text-sm text-indigo-600 hover:text-indigo-700">
                View all
              </button>
            </div>

            {!recent || recent.length === 0 ? (
              <div className="text-sm text-slate-500">
                No diagnoses yet. Start with{" "}
                <button onClick={onNew} className="text-indigo-600 underline">
                  a new diagnosis
                </button>
                .
              </div>
            ) : (
              <div className="divide-y">
                {recent.slice(0, 5).map((r) => (
                  <div key={r.id} className="py-3 flex items-center justify-between">
                    <div className="min-w-0">
                      <div className="font-medium truncate">
                        {r.name ?? "Unknown patient"} • {r.age ?? "—"} yrs
                      </div>
                      <div className="text-sm text-slate-500 truncate max-w-xl">Final: {r.final || "—"}</div>
                    </div>
                    <div className="flex items-center gap-2 pl-3">
                      <Badge kind={r.hadError ? "warn" : "ok"}>
                        {r.hadError ? "Partial" : "Complete"}
                      </Badge>
                      <button
                        onClick={onHistory}
                        className="text-sm text-indigo-600 hover:text-indigo-800"
                      >
                        Open
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </section>

        {/* Trends + Insights */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 📈 Patient Trends mini chart */}
          <Card className="lg:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Patient Trends</h3>
              <span className="text-xs text-slate-400">Last 4 weeks</span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={trendData}>
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="patients" stroke="#2563eb" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* 💡 System Insights */}
          <Card>
            <h3 className="text-lg font-semibold">System Insights</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>⚙️ Cardiologist agent used in multiple recent cases.</li>
              <li>💡 AI response time trending stable week-over-week.</li>
              <li>🧠 New pulmonary dataset integration planned.</li>
            </ul>
          </Card>
        </section>

        {/* Search banner (unchanged) */}
        <Card className="bg-gradient-to-br from-slate-50 to-white">
          <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Search your patient history</h3>
              <p className="text-sm text-slate-500">Semantic search across past diagnoses and reports.</p>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const q = new FormData(e.currentTarget).get("q");
                nav(`/history?q=${encodeURIComponent(q)}`);
              }}
              className="flex w-full md:w-auto gap-2"
            >
              <input
                name="q"
                placeholder="e.g., chest pain negative troponin"
                className="w-full md:w-80 rounded-lg border px-3 py-2"
              />
              <button className="px-4 py-2 rounded-lg bg-slate-900 text-white">Search</button>
            </form>
          </div>
        </Card>

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2">
            <AgentTile
              title="Follow-Up Copilot"
              endpoint="/agent/followup"
              placeholder="Paste a summary or last diagnosis to get a follow-up plan…"
              buttonLabel="Generate Plan"
            />
          </div>

        <AgentTile
          title="ICD-10 Coder"
          endpoint="/agent/icd10"
          placeholder="Paste final diagnosis or patient problem list…"
          buttonLabel="Suggest Codes"
        />
      </section>

      </div>
    </main>
  );
}
