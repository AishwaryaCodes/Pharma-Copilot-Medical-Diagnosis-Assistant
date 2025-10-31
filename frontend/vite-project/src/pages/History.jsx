import { useEffect, useMemo, useState } from "react";
import API from "../utils/api";
import { MdSearch, MdEdit, MdDelete } from "react-icons/md";
import toast from "react-hot-toast";

export default function History() {
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const client = API;

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 6;

  // Modal
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleRowClick = (patient) => {
    setSelectedPatient(patient);
    setShowModal(true);
  };

  const handleEdit = (report) => {
    console.log("Editing", report);
  };

  const handleDelete = async (report) => {
    const confirmed = window.confirm(`Delete report for ${report.name}?`);
    if (confirmed) {
      try {
        await client.delete(`/history/${report.id}`);
        toast.success("Deleted successfully");
        setReports((prev) => prev.filter((r) => r.id !== report.id));
      } catch (err) {
        toast.error(err.response?.data?.detail || "Failed to delete");
      }
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await client.get("/history", { params: { q: "", limit: 50 } });
        // Expect backend to return: { items: [...] }
        const items = Array.isArray(res.data)
          ? res.data
          : res.data.items || res.data.data || [];

        // Normalize fields for the UI
        const normalized = items.map((d) => ({
          id: d.id,
          name: d.patient_name || d.name,
          age: d.patient_age || d.age,
          medical_report: d.medical_report || "",
          final_diagnosis: d.final_diagnosis || d.final || "",
          created_at: d.created_at || null,
        }));

        setReports(normalized);
        setFiltered(normalized);
      } catch (err) {
        console.error("Failed to fetch history:", err);
        toast.error(err.response?.data?.detail || "Failed to fetch history");
      } finally {
        setLoading(false);
      }
    })();
  }, [client]);

  useEffect(() => {
    const q = search.toLowerCase();
    const filteredReports = reports.filter(
      (r) =>
        (r.name || "").toLowerCase().includes(q) ||
        (r.medical_report || "").toLowerCase().includes(q) ||
        (r.final_diagnosis || "").toLowerCase().includes(q)
    );
    setFiltered(filteredReports);
    setCurrentPage(1);
  }, [search, reports]);

  // Pagination
  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = filtered.slice(indexOfFirstReport, indexOfLastReport);
  const totalPages = Math.ceil(filtered.length / reportsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <h1 className="text-2xl font-bold mb-6 text-center text-blue-800">
        Diagnosis History
      </h1>

      <div className="relative w-full max-w-lg mx-auto mb-6">
        <input
          type="text"
          placeholder="Search by name, report, or final diagnosis…"
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-red-600">No records found.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-md">
              <thead>
                <tr className="bg-blue-100 text-blue-800 text-left text-sm font-semibold">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Age</th>
                  <th className="px-4 py-3">Diagnosis Summary</th>
                  <th className="px-4 py-3">Created</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {currentReports.map((report) => (
                  <tr
                    key={report.id}
                    className="border-t text-sm text-gray-700 hover:bg-blue-50 cursor-pointer transition"
                    onClick={() => handleRowClick(report)}
                  >
                    <td className="px-4 py-3">{report.name}</td>
                    <td className="px-4 py-3">{report.age ?? "—"}</td>
                    <td className="px-4 py-3 whitespace-nowrap overflow-hidden text-ellipsis max-w-[320px]">
                      {report.final_diagnosis?.slice(0, 130) || report.medical_report?.slice(0, 130) || "—"}…
                    </td>
                    <td className="px-4 py-3">
                      {report.created_at ? new Date(report.created_at).toLocaleString() : "—"}
                    </td>
                    <td className="px-2 py-3">
                      <MdEdit
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(report);
                        }}
                        className="cursor-pointer"
                        title="Edit"
                      />
                    </td>
                    <td className="px-2 py-3">
                      <MdDelete
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(report);
                        }}
                        className="cursor-pointer"
                        title="Delete"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {showModal && selectedPatient && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-xl max-w-lg w-full mx-4 overflow-y-auto max-h-[90vh] shadow-lg">
                  <h2 className="text-xl font-semibold mb-4 text-blue-800">
                    Patient Report
                  </h2>
                  <p className="mb-2"><strong>Name:</strong> {selectedPatient.name}</p>
                  <p className="mb-2"><strong>Age:</strong> {selectedPatient.age ?? "—"}</p>
                  <p className="mb-2"><strong>Report:</strong> {selectedPatient.medical_report || "—"}</p>
                  <p className="mb-2"><strong>Final Diagnosis:</strong> {selectedPatient.final_diagnosis || "—"}</p>
                  <div className="text-right mt-4">
                    <button
                      onClick={() => setShowModal(false)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="mt-4 flex justify-center items-center space-x-2">
            {[...Array(totalPages).keys()].map((page) => (
              <button
                key={page + 1}
                onClick={() => setCurrentPage(page + 1)}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  currentPage === page + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {page + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
