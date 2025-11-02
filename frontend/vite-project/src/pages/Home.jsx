// src/pages/Home.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import Header from "../components/Header";
import toast from "react-hot-toast";
import { exportDiagnosisAsTxt } from "../utils/exportToTxt";
import {
  MdFavoriteBorder,
  MdPsychology,
  MdAir,
  MdSummarize,
  MdContentCopy,
  MdDownload,
  MdAddCircleOutline,
  MdCheckCircle,
  MdSchedule,
  MdBolt,
  MdMic,
  MdMicOff,
  MdImage,
  MdAttachFile,
  MdCleaningServices,
  MdSearch,
} from "react-icons/md";

/* ---------- Small UI building blocks ---------- */
function Card({ children, className = "" }) {
  return <div className={`rounded-2xl bg-white p-5 shadow-sm border ${className}`}>{children}</div>;
}

function StatChip({ icon: Icon, label, value, muted = false }) {
  return (
    <div className={`flex items-center gap-2 rounded-xl px-3 py-2 border ${muted ? "bg-slate-50" : "bg-indigo-50"}`}>
      <Icon className={`${muted ? "text-slate-500" : "text-indigo-600"}`} />
      <div>
        <div className="text-[11px] uppercase tracking-wide text-slate-500">{label}</div>
        <div className="text-sm font-semibold">{value}</div>
      </div>
    </div>
  );
}

function Step({ active, done, label }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`h-6 w-6 rounded-full grid place-items-center text-white text-xs ${done ? "bg-emerald-500" : active ? "bg-indigo-600" : "bg-slate-300"}`}>
        {done ? "✓" : active ? "…" : ""}
      </div>
      <div className={`text-sm ${done ? "text-emerald-700" : active ? "text-indigo-700" : "text-slate-500"}`}>{label}</div>
    </div>
  );
}

/* ---------- Specialist strips (not accordion) ---------- */
const SPECIALIST_CARDS = [
  { key: "cardiologist_result", title: "Cardiologist Result", icon: MdFavoriteBorder, tint: "border-l-4 border-rose-400 bg-rose-50", text: "text-rose-900" },
  { key: "psychologist_result", title: "Psychologist Result", icon: MdPsychology, tint: "border-l-4 border-amber-400 bg-amber-50", text: "text-amber-900" },
  { key: "pulmonologist_result", title: "Pulmonologist Result", icon: MdAir, tint: "border-l-4 border-sky-400 bg-sky-50", text: "text-sky-900" },
];

/* ---------- symptom typo fixer (no LLM) ---------- */
const SYMPTOM_CORRECTIONS = {
  "shortnest": "shortness",
  "feaver": "fever",
  "breth": "breath",
  "breathing difficulity": "breathing difficulty",
  "difficulity": "difficulty",
  "migrane": "migraine",
  "diarrhoea": "diarrhea", // US spelling
  "haemoptysis": "hemoptysis",
  "tackhycardia": "tachycardia",
  "oxgen": "oxygen",
  "temprature": "temperature",
  "siezure": "seizure",
  "chest pian": "chest pain",
  "headach": "headache",
};

function applyCorrections(text) {
  let fixed = text;
  for (const [bad, good] of Object.entries(SYMPTOM_CORRECTIONS)) {
    const re = new RegExp(`\\b${bad}\\b`, "gi");
    fixed = fixed.replace(re, good);
  }
  return fixed;
}

export default function Home() {
  const navigate = useNavigate();

  /* ------- form & attachments ------- */
  const [formData, setFormData] = useState({ name: "", age: "", medical_report: "" });
  const [images, setImages] = useState([]);         // File[]
  const [documents, setDocuments] = useState([]);   // File[]
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  /* ------- results & UX ------- */
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [step, setStep] = useState(0); // 0=submitted,1=running,2=ready
  const [similar, setSimilar] = useState([]);
  const [caseId, setCaseId] = useState(null); // will use backend id
  const startTimeRef = useRef(null);
  const [elapsed, setElapsed] = useState(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  /* ------- similar cases (debounced) ------- */
  const queryForSimilar = useMemo(() => {
    const text = (formData.medical_report || "").toLowerCase();
    const words = text.match(/[a-z]+/g) || [];
    return words.slice(0, 6).join(" ");
  }, [formData.medical_report]);

  useEffect(() => {
    const t = setTimeout(async () => {
      if (!localStorage.getItem("token") || !queryForSimilar) return;
      try {
        const { data } = await API.get("/history", { params: { q: queryForSimilar, limit: 5 } });
        const items = Array.isArray(data) ? data : data.items || data.data || [];
        setSimilar(items.map((d) => ({
          id: d.id,
          name: d.patient_name || d.name,
          age: d.patient_age || d.age,
          final: d.final_diagnosis || d.final || "",
          created_at: d.created_at,
        })));
      } catch (_) {}
    }, 350);
    return () => clearTimeout(t);
  }, [queryForSimilar]);

  /* ------- file handlers (front-end only; wire to backend later) ------- */
  const onPickImages = (e) => {
    const files = Array.from(e.target.files || []).slice(0, 5);
    setImages(files);
  };
  const onPickDocs = (e) => {
    const files = Array.from(e.target.files || []).slice(0, 3);
    setDocuments(files);
  };

  const scanAttachments = async () => {
    if (images.length === 0 && documents.length === 0) {
      toast("Attach images or files first.");
      return;
    }
    // Front-end stub: you can POST FormData to /analyze_uploads when backend is ready
    toast.success("Scanning attachments… (wire this to your backend OCR/LLM later)");
  };

  /* ------- mic dictation (Web Speech API) ------- */
  const startMic = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      toast.error("Speech recognition not supported in this browser.");
      return;
    }
    const rec = new SR();
    rec.lang = "en-US";
    rec.continuous = true;
    rec.interimResults = true;
    rec.onresult = (e) => {
      let finalTranscript = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalTranscript += t + " ";
      }
      if (finalTranscript) {
        setFormData((f) => ({ ...f, medical_report: (f.medical_report + " " + finalTranscript).trim() }));
      }
    };
    rec.onend = () => setListening(false);
    recognitionRef.current = rec;
    rec.start();
    setListening(true);
  };
  const stopMic = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  /* ------- submit diagnosis ------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!localStorage.getItem("token")) {
      toast.error("Please log in first.");
      navigate("/login");
      return;
    }
    if (!formData.name || !formData.age || !formData.medical_report) {
      toast.error("Please fill all fields.");
      return;
    }
    setLoading(true);
    setResult(null);
    setElapsed(null);
    setStep(0);
    startTimeRef.current = performance.now();

    try {
      setStep(1);
      const res = await API.post("/diagnose", {
        name: formData.name,
        age: Number.isFinite(parseInt(formData.age, 10)) ? parseInt(formData.age, 10) : null,
        medical_report: formData.medical_report,
      });
      setResult(res.data);
      setCaseId(res.data?.id ?? Math.floor(1000 + Math.random() * 9000)); // use backend ID
      setStep(2);
      const took = (performance.now() - startTimeRef.current) / 1000;
      setElapsed(took);
      toast.success("Diagnosis completed successfully!");
    } catch (error) {
      if (error?.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
      toast.error("Diagnosis failed.");
      setStep(0);
    } finally {
      setLoading(false);
    }
  };

  /* ------- helpers ------- */
  const copyAll = async () => {
    if (!result) return;
    const txt = [
      `Patient: ${formData.name}, Age: ${formData.age}`,
      "",
      "Cardiologist:",
      result.cardiologist_result || "-",
      "",
      "Psychologist:",
      result.psychologist_result || "-",
      "",
      "Pulmonologist:",
      result.pulmonologist_result || "-",
      "",
      "Final Diagnosis:",
      result.final_diagnosis || "-",
    ].join("\n");
    await navigator.clipboard.writeText(txt);
    toast.success("Copied results to clipboard");
  };

  const resetCase = () => {
    setFormData({ name: "", age: "", medical_report: "" });
    setResult(null);
    setSimilar([]);
    setCaseId(null);
    setStep(0);
    setElapsed(null);
    setImages([]);
    setDocuments([]);
  };

  const approxTokens = useMemo(() => {
    const len = (formData.medical_report || "").length;
    return Math.max(50, Math.round(len / 4)); // ~4 chars/token
  }, [formData.medical_report]);

  const runAutocorrect = () => {
    if (!formData.medical_report) return;
    const fixed = applyCorrections(formData.medical_report);
    if (fixed !== formData.medical_report) {
      setFormData((f) => ({ ...f, medical_report: fixed }));
      toast.success("Corrected common medical spellings.");
    } else {
      toast("Looks good!");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Case header */}
        <Card className="bg-gradient-to-r from-indigo-50 to-sky-50">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-semibold">Health Diagnosis AI</h1>
              <p className="text-sm text-slate-500">
                Case <span className="font-medium">#{caseId ?? "—"}</span> • {new Date().toLocaleString()}
              </p>
            </div>

            {/* Stepper */}
            <div className="flex items-center gap-4">
              <Step label="Submitted" active={step === 0} done={step >= 1} />
              <div className="h-px w-8 bg-slate-300" />
              <Step label="Agents running" active={step === 1} done={step >= 2} />
              <div className="h-px w-8 bg-slate-300" />
              <Step label="Results ready" active={step === 2} done={step >= 2} />
            </div>
          </div>
        </Card>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT: Inputs + Similar Cases */}
          <div className="space-y-6">
            <Card>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Enter Patient Details</h2>
                  <span className="text-xs text-slate-400">Fields marked * are required</span>
                </div>

                <label className="block">
                  <span className="text-sm font-medium text-gray-800">Patient Name *</span>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 bg-white"
                    placeholder="e.g., Jane Doe"
                    required
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-gray-800">Age *</span>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 bg-white"
                    placeholder="e.g., 56"
                    required
                  />
                </label>

                <label className="block">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-800">Medical Report *</span>
                    <div className="flex items-center gap-2">
                      {listening ? (
                        <button type="button" onClick={stopMic} className="text-xs inline-flex items-center gap-1 px-2 py-1 rounded border hover:bg-slate-50" title="Stop mic">
                          <MdMicOff /> Stop
                        </button>
                      ) : (
                        <button type="button" onClick={startMic} className="text-xs inline-flex items-center gap-1 px-2 py-1 rounded border hover:bg-slate-50" title="Dictate with mic">
                          <MdMic /> Dictate
                        </button>
                      )}
                    </div>
                  </div>
                  <textarea
                    name="medical_report"
                    value={formData.medical_report}
                    onChange={handleChange}
                    rows="6"
                    className="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 bg-white"
                    placeholder="Chief complaints, vitals, relevant history, labs/imaging..."
                    required
                    spellCheck={true}
                  ></textarea>
                </label>

                {/* Attachments */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-800 flex items-center gap-2">
                      <MdImage className="text-slate-500" /> Images (up to 5)
                    </label>
                    <input type="file" accept="image/*" multiple onChange={onPickImages} className="mt-1 block w-full text-sm" />
                    {images.length > 0 && (
                      <div className="mt-2 flex gap-2 flex-wrap">
                        {images.map((f, idx) => (
                          <div key={idx} className="w-16 h-16 rounded-lg overflow-hidden border">
                            <img src={URL.createObjectURL(f)} alt="preview" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-800 flex items-center gap-2">
                      <MdAttachFile className="text-slate-500" /> Files (PDF, DOCX – up to 3)
                    </label>
                    <input type="file" accept=".pdf,.doc,.docx,.txt" multiple onChange={onPickDocs} className="mt-1 block w-full text-sm" />
                    {documents.length > 0 && (
                      <ul className="mt-2 text-xs text-slate-600 space-y-1">
                        {documents.map((f, i) => (
                          <li key={i} className="truncate">• {f.name}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex gap-2">
                    <StatChip icon={MdSchedule} label="Approx. Tokens" value={approxTokens.toLocaleString()} muted />
                    <StatChip icon={MdBolt} label="Agents" value="3 Specialists" muted />
                  </div>

                  <div className="flex gap-2">
                    <button type="button" onClick={scanAttachments} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-slate-50">
                      <MdSearch /> Scan attachments with AI
                    </button>

                    <button
                      type="submit"
                      className={`inline-flex items-center justify-center gap-2 px-5 py-2 rounded-lg text-white font-medium transition ${
                        loading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
                      }`}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Running Diagnosis…
                        </>
                      ) : (
                        <>
                          <MdAddCircleOutline className="text-xl" />
                          Run AI Diagnosis
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </Card>

            {/* Similar Cases */}
            <Card>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Similar Recent Cases</h3>
                <span className="text-xs text-slate-400">Auto-matched by keywords</span>
              </div>
              {similar.length === 0 ? (
                <div className="text-sm text-slate-500">Start typing a medical report to see similar cases…</div>
              ) : (
                <ul className="divide-y">
                  {similar.map((s) => (
                    <li key={s.id} className="py-2 flex items-start justify-between">
                      <div className="min-w-0">
                        <div className="font-medium truncate">{s.name ?? "Unknown"} • {s.age ?? "—"} yrs</div>
                        <div className="text-sm text-slate-500 truncate max-w-xl">{s.final || "—"}</div>
                      </div>
                      <button className="text-indigo-600 text-sm hover:text-indigo-800" onClick={() => navigate("/history")}>
                        Open
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>

          {/* RIGHT: Results & Insights */}
          <div className="space-y-6">
            <Card>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Diagnosis Results</h2>
                <div className="flex gap-2">
                  <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-slate-50" onClick={copyAll} disabled={!result} title="Copy all results">
                    <MdContentCopy /> Copy
                  </button>
                  <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-slate-50" onClick={() => result && exportDiagnosisAsTxt(result)} disabled={!result} title="Download .txt">
                    <MdDownload /> Download
                  </button>
                  <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-slate-50" onClick={resetCase} title="Start a new case">
                    <MdAddCircleOutline /> New
                  </button>
                </div>
              </div>

              {!loading && !result && (
                <div className="text-sm text-slate-500 mt-2">
                  Run a diagnosis to view specialist reports and the final summary here.
                </div>
              )}

              {loading && (
                <div className="mt-6 flex flex-col items-center text-indigo-700">
                  <div className="h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  <p className="mt-3 text-sm">Consulting specialists…</p>
                </div>
              )}

              {result && (
                <div className="mt-4 space-y-4">
                  {SPECIALIST_CARDS.map(({ key, title, icon: Icon, tint, text }) => (
                    <div key={key} className={`rounded-xl p-4 ${tint}`}>
                      <div className="flex items-center justify-between">
                        <div className={`flex items-center gap-2 font-semibold ${text}`}>
                          <Icon className="text-xl" />
                          {title}
                        </div>
                        <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                          <MdCheckCircle className="text-emerald-600" />
                          Completed
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-slate-800 whitespace-pre-wrap">
                        {result[key] || "No data available."}
                      </p>
                    </div>
                  ))}

                  {/* Final summary */}
                  <div className="rounded-xl p-4 border border-indigo-200 bg-indigo-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-indigo-900 font-semibold">
                        <MdSummarize className="text-xl" />
                        Final Diagnosis
                      </div>
                      <span className="text-xs text-indigo-700 bg-indigo-100 px-2 py-1 rounded-full border border-indigo-200">
                        AI Summary
                      </span>
                    </div>
                    <p className="mt-2 text-slate-800 text-sm leading-relaxed whitespace-pre-wrap">
                      {result.final_diagnosis || "—"}
                    </p>
                  </div>
                </div>
              )}
            </Card>

            {/* Mini stats + timeline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card>
                <div className="text-sm font-semibold mb-3">Case Stats</div>
                <div className="flex flex-wrap gap-2">
                  <StatChip icon={MdSchedule} label="AI Turnaround" value={elapsed ? `${elapsed.toFixed(1)}s` : "—"} />
                  
                  <StatChip icon={MdContentCopy} label="Report Length" value={`${(formData.medical_report || "").length} chars`} />
                </div>
              </Card>

              <Card>
                <div className="text-sm font-semibold mb-3">Case Timeline</div>
                <ol className="text-sm space-y-2 text-slate-700">
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-slate-400" />
                    Form submitted
                  </li>
                  <li className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${step >= 1 ? "bg-indigo-500" : "bg-slate-200"}`} />
                    Specialists analyzing
                  </li>
                  <li className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${step >= 2 ? "bg-emerald-500" : "bg-slate-200"}`} />
                    Final diagnosis generated
                  </li>
                </ol>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
