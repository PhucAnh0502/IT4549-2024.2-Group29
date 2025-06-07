import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaTrash, FaWrench, FaCheckCircle } from "react-icons/fa";

const RoomButtons = ({ id, onRoomRefresh }) => {
  const navigate = useNavigate();
  const API_PATH = import.meta.env.VITE_API_PATH;
  const department = localStorage.getItem("department");
  const role = localStorage.getItem("accountRole").toLowerCase();

  const handleDelete = async (id) => {
    const confirm = window.confirm("Do you want to delete ?");
    if (confirm) {
      try {
        const response = await axios.delete(`${API_PATH}/Room/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data) {
          onRoomRefresh();
        }
      } catch (err) {
        if (err.response.Message) {
          alert(err.response.Message);
        }
      }
    }
  };

  const handleAvailable = async (id) => {
    try {
      const response = await axios.put(
        `${API_PATH}/Room/available/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data) {
        console.log(response.data);
        onRoomRefresh();
      }
    } catch (err) {
      if (err.response.Message) {
        alert(err.response.Message);
      }
    }
  };

  const handleMaintainance = async (id) => {
    try {
      const response = await axios.put(
        `${API_PATH}/Room/maintenance/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data) {
        console.log(response.data);
        onRoomRefresh();
      }
    } catch (err) {
      if (err.response.Message) {
        alert(err.response.Message);
      }
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      <button
        className="p-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:scale-105"
        onClick={() => navigate(`/${role}-dashboard/rooms/${id}`)}
      >
        <FaEye size={18} />
      </button>

      {(role === "admin" || department === "Equipment") && (
        <>
          <button
            className="p-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:scale-105"
            onClick={() => handleDelete(id)}
          >
            <FaTrash size={18} />
          </button>

          <button
            className="p-2 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:scale-105"
            onClick={() => handleMaintainance(id)}
          >
            <FaWrench size={18} />
          </button>
        </>
      )}

      {role === "admin" && (
        <button
          className="p-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:scale-105"
          onClick={() => handleAvailable(id)}
        >
          <FaCheckCircle size={18} />
        </button>
      )}
    </div>
  );
};

export default RoomButtons;
