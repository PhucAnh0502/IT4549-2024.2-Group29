import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";

const TrainerReportDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const API_PATH = import.meta.env.VITE_API_PATH;

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get(`${API_PATH}/Report/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setReport(res.data);
      } catch (err) {
        console.log(err.response.data.Message)
        alert("You are not allowed to view this report.");
        navigate("/trainer-dashboard/reports");
      }
    };

    fetchReport();
  }, [id, navigate, API_PATH]);

  if (!report) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-red-500 font-semibold animate-pulse">Loading report...</p>
      </div>
    );
  }

  return (
    <div className="p-5 max-w-3xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 mb-4 hover:underline"
      >
        <FaArrowLeft className="mr-2" />
        Back
      </button>

      <div className="bg-white rounded shadow p-6">
        <h2 className="text-2xl font-bold mb-4">{report.title}</h2>

        <div className="mb-2">
          <strong>Type:</strong> {report.reportType}
        </div>
        <div className="mb-2">
          <strong>Status:</strong> {report.status}
        </div>
        <div className="mb-4">
          <strong>Created At:</strong>{" "}
          {new Date(report.createdAt).toLocaleString()}
        </div>

        <div className="border rounded p-4 bg-gray-50 whitespace-pre-line">
          {report.content || "No content available."}
        </div>
      </div>
    </div>
  );
};

export default TrainerReportDetail;
