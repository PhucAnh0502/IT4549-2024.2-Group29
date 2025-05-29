import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserButtons = ({ id, onUserDelete }) => {
  const navigate = useNavigate();
  const API_PATH = import.meta.env.VITE_API_PATH;
  const role = localStorage.getItem('accountRole').toLowerCase()

  const currentUserId = localStorage.getItem("userId");

  const handleDelete = async (id) => {
    if (id.toString() === currentUserId) {
      alert("You cannot delete your own account !");
      return;
    }

    const confirm = window.confirm("Do you want to delete ?");
    if (confirm) {
      try {
        const response = await axios.delete(`${API_PATH}/User/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data) {
          onUserDelete();
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
        onClick={() => navigate(`/${role}-dashboard/users/${id}`)}
      >
        View
      </button>
      {localStorage.getItem("accountRole") === "Admin" && (
        <button
          className="mr-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:scale-105"
          onClick={() => handleDelete(id)}
        >
          Delete
        </button>
      )}
    </div>
  );
};

export default UserButtons;
