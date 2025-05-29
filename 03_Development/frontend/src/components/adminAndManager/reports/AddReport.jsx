import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddReport = () => {
  const navigate = useNavigate();
  const [report, setReport] = useState({
    title: "",
    reportType: 0,
    content: "",
  });

  const API_PATH = import.meta.env.VITE_API_PATH;
  const role = localStorage.getItem('accountRole').toLowerCase()

  const handleSubmit = async () => {
    console.log(report)
    try {
      const response = await axios.post(
        `${API_PATH}/Report/create`,
        report,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert(response.data.message);
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md space-y-4 mt-10"
    >
      <div className="flex items-center justify-between mb-6 relative">
        <button
          onClick={() => navigate(`/${role}-dashboard/reports`)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-2"
        >
          <span className="text-lg">←</span> Back
        </button>
        <div className="w-full text-center">
          <h2 className="text-3xl font-bold text-red-600">Add New Report</h2>
        </div>
      </div>

      <div>
        <label className="block font-medium mb-1">Title</label>
        <input
          type="text"
          name="name"
          className="w-full px-4 py-2 border rounded-lg"
          onChange={(e) => setReport({ ...report, title: e.target.value })}
          required
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Report Type</label>
        <select
          name="reportType"
          className="w-full px-4 py-2 border rounded-lg"
          onChange={(e) =>
            setReport({ ...report, reportType: parseInt(e.target.value) })
          }
          required
        >
          <option value="">Select Report Type</option>
          <option value="0">Equipment</option>
          <option value="1">User</option>
          <option value="2">Training Record</option>
          <option value="3">Course</option>
          <option value="4">Room</option>
          <option value="5">Environment</option>
          <option value="6">Other</option>
        </select>
      </div>

      <div>
        <label className="block font-semibold mb-1">Content:</label>
        <textarea
          value={report.content || ""}
          onChange={(e) => setReport({ ...report, content: e.target.value })}
          required
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
      >
        Add Report
      </button>
    </form>
  );
};

export default AddReport;
