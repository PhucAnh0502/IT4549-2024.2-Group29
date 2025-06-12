import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEye, FaTrashAlt, FaEdit } from 'react-icons/fa';

const TrainerRecordButtons = ({ id, onTrainingRecordDelete }) => {
  const navigate = useNavigate();
  const API_PATH = import.meta.env.VITE_API_PATH;
  const role = localStorage.getItem('accountRole')?.toLowerCase();

  const handleDelete = async (id) => {
    const confirm = window.confirm("Do you want to delete this training record?");
    if (confirm) {
      try {
        const response = await axios.delete(`${API_PATH}/TrainingRecord/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data) {
          onTrainingRecordDelete();
        }
      } catch (err) {
        const message = err.response?.data?.message || "Failed to delete training record.";
        alert(message);
      }
    }
  };

  return (
    <div className="flex space-x-2 justify-center">
      {/* View */}
      <button
        className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition duration-200"
        onClick={() => navigate(`/${role}-dashboard/training-records/${id}`)}
        title="View"
      >
        <FaEye />
        <span className="hidden md:inline">View</span>
      </button>

      {/* Edit */}
      <button
        className="flex items-center gap-2 px-3 py-2 bg-yellow-500 text-white rounded-lg shadow hover:bg-yellow-600 transition duration-200"
        onClick={() => navigate(`/${role}-dashboard/training-records/edit/${id}`)}
        title="Edit"
      >
        <FaEdit />
        <span className="hidden md:inline">Edit</span>
      </button>

      {/* Delete */}
      <button
        className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition duration-200"
        onClick={() => handleDelete(id)}
        title="Delete"
      >
        <FaTrashAlt />
        <span className="hidden md:inline">Delete</span>
      </button>
    </div>
  );
};

export default TrainerRecordButtons;
