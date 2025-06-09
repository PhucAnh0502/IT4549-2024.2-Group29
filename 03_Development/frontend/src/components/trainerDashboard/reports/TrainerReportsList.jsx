import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const TrainerReportsList = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const API_PATH = import.meta.env.VITE_API_PATH;
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const reportIds = JSON.parse(localStorage.getItem("trainerReportIds")) || []; // giả sử bạn lưu trước

  const fetchEachReport = async (id) => {
    try {
      const res = await axios.get(`${API_PATH}/Report/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      // Nếu bị 403 nghĩa là trainer không được phép xem report này => bỏ qua
      return null;
    }
  };

  const fetchTrainerReports = async () => {
    setLoading(true);
    try {
      const results = await Promise.all(reportIds.map(fetchEachReport));
      const filtered = results.filter((r) => r !== null);

      let sno = 1;
      const formatted = filtered.map((report) => ({
        id: report.id,
        sno: sno++,
        title: report.title,
        reportType: report.reportType,
        status: report.status,
        createdAt: new Date(report.createdAt).toLocaleDateString(),
        action: (
          <button
            onClick={() => navigate(`/trainer-dashboard/reports/${report.id}`)}
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 flex items-center gap-2"
          >
            <FaEye />
            View
          </button>
        ),
      }));

      setReports(formatted);
    } catch (err) {
      console.error(err);
      alert("Failed to load your reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainerReports();
  }, []);

  const columns = [
    { name: "No.", selector: (row) => row.sno, width: "60px" },
    { name: "Title", selector: (row) => row.title, sortable: true },
    { name: "Type", selector: (row) => row.reportType, sortable: true },
    { name: "Status", selector: (row) => row.status, sortable: true },
    { name: "Created At", selector: (row) => row.createdAt },
    {
      name: "Action",
      cell: (row) => row.action,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-5 text-center">My Reports</h2>
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="text-center animate-pulse text-red-500 font-semibold">
            Loading...
          </div>
        </div>
      ) : (
        <DataTable columns={columns} data={reports} pagination />
      )}
    </div>
  );
};

export default TrainerReportsList;
