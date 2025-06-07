import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaTrash } from "react-icons/fa";

const CourseButtons = ({ id, onCourseDelete }) => {
  const navigate = useNavigate();
  const API_PATH = import.meta.env.VITE_API_PATH;

  const role = localStorage.getItem("accountRole").toLowerCase();

  const handleDelete = async (id) => {
    const confirm = window.confirm("Do you want to delete ?");
    if (confirm) {
      try {
        const response = await axios.delete(`${API_PATH}/Course/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data) {
          onCourseDelete();
        }
      } catch (err) {
        if (err.response.Message) {
          alert(err.response.Message);
        }
      }
    }
  };
  return (
    <div className="flex space-x-3">
      <button
        className="ml-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:scale-105"
        onClick={() => navigate(`/${role}-dashboard/courses/${id}`)}
      >
        <FaEye size={18}/>
      </button>
      {role === "admin" && (
        <button
          className="mr-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:scale-105"
          onClick={() => handleDelete(id)}
        >
          <FaTrash size={18} />
        </button>
      )}
    </div>
  );
};

export default CourseButtons;
