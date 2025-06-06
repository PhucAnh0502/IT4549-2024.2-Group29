import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaTrash } from "react-icons/fa";

const ReportButtons = ({ id, onReportRefresh, createdUserId }) => {
  const navigate = useNavigate();
  const [isCreated, setIsCreated] = useState(false);
  const API_PATH = import.meta.env.VITE_API_PATH;
  const role = localStorage.getItem("accountRole").toLowerCase();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    console.log("userId : ", userId)
    console.log("createdUserId : ", createdUserId)
    setIsCreated(userId === createdUserId);
  }, [userId, createdUserId]);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Do you want to delete ?");
    if (confirm) {
      try {
        const response = await axios.delete(`${API_PATH}/Report/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data) {
          onReportRefresh();
        }
      } catch (err) {
        if (err.response.Message) {
          alert(err.response.Message);
        }
      }
    }
  };

  return (
    <div className="flex flex-wrap gap-3 ml-2 mr-2 p-2">
      <button
        className="px-3 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:scale-105"
        onClick={() => navigate(`/${role}-dashboard/reports/${id}`)}
      >
        <FaEye size={18} />
      </button>
      {isCreated && (
        <button
          className="px-3 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:scale-105"
          onClick={() => handleDelete(id)}
        >
          <FaTrash size={18} />
        </button>
      )}
    </div>
  );
};

export default ReportButtons;
