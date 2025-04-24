import { useEffect, useState } from "react";
import axios from "axios";

export default function History() {
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 8;

  useEffect(() => {
    axios.get("http://localhost:8000/history")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.data || [];
        setReports(data);
        setFiltered(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch history:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    const filteredReports = reports.filter(
      (r) =>
        r.name?.toLowerCase().includes(q) ||
        r.medical_report?.toLowerCase().includes(q)
    );
    setFiltered(filteredReports);
    setCurrentPage(1); // reset to first page when search changes
  }, [search, reports]);

  // Pagination Logic
  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = filtered.slice(indexOfFirstReport, indexOfLastReport);
  const totalPages = Math.ceil(filtered.length / reportsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <h1 className="text-2xl font-bold mb-6 text-center text-blue-800">Diagnosis History</h1>

      <input
        type="text"
        placeholder="Search by name or report..."
        className="w-full max-w-lg block mx-auto px-4 py-2 border border-gray-300 rounded-lg shadow-sm mb-6"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

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
                </tr>
              </thead>
              <tbody>
                {currentReports.map((report) => (
                  <tr key={report.id} className="border-t text-sm text-gray-700 hover:bg-blue-50">
                    <td className="px-4 py-3">{report.name}</td>
                    <td className="px-4 py-3">{report.age}</td>
                    <td className="px-4 py-3">{report.final_diagnosis?.slice(0, 80)}...</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
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
