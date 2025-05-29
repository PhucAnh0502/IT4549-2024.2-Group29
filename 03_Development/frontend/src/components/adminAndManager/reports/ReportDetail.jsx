import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import EditForm from "./EditForm";
import ReportDetailActions from "./ReportDetailActions";
import ReportInfo from "./ReportInfo";
import CreatedByInfo from "./CreatedByInfo";

const ReportDetail = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState({});
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const API_PATH = import.meta.env.VITE_API_PATH;

  const getReport = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_PATH}/Report/${reportId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setReport(res.data);
    } catch (err) {
      alert(err.response?.data?.Message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    try {
      const response = await axios.put(
        `${API_PATH}/Report/update`,
        {
          title: report.title,
          reportType: parseInt(report.reportType),
          content: report.content,
          id: reportId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert(response.data.message);
      setIsEditing(false);
      getReport();
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  const handleChangeStatus = async (status) => {
    try {
      const response = await axios.put(
        `${API_PATH}/Report/change-status`,
        {
          id: reportId,
          reportStatus: status,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert(response.data.message);
      getReport();
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  useEffect(() => {
    getReport();
  }, [reportId]);

  if (loading) return <div className="flex justify-center items-center h-screen">
  <div className="text-center">
    <div className="w-12 h-12 border-4 border-red-500 rounded-full animate-spin border-t-transparent mb-4"></div>
    <p className="text-lg font-semibold text-red-500 animate-pulse">
      Loading...
    </p>
  </div>
</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg mt-20">
      <div className="flex items-center justify-between mb-6 relative">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-2"
        >
          <span className="text-lg">←</span> Back
        </button>
        <div className="w-full text-center">
          <h2 className="text-3xl font-bold text-red-600">{report.title}</h2>
        </div>
      </div>

      <div className="space-y-4 text-gray-700">
        {isEditing ? (
          <EditForm report={report} setReport={setReport} />
        ) : (
          <ReportInfo report={report} />
        )}
      </div>

      <CreatedByInfo createdByUser={report.createdByUser} />

      <ReportDetailActions
        isEditing={isEditing}
        onSave={handleEdit}
        onEdit={() => setIsEditing(true)}
        onResolve={() => handleChangeStatus(1)}
        onReject={() => handleChangeStatus(2)}
        createdUserId={report.createdByUser?.id}
      />
    </div>
  );
};

export default ReportDetail;
