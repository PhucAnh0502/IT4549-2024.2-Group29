import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddRoom = () => {
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState("");
  const [roomType, setRoomType] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [error, setError] = useState("");

  const API_PATH = import.meta.env.VITE_API_PATH;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_PATH}/Room/create`,
        {
          roomName: roomName,
          roomType: parseInt(roomType),
          roomNumber: parseInt(roomNumber),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response.data);
      if (response) {
        setError("");
        navigate(-1);
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Unexpected error occurred");
      }
    }
  };

  return (
    <div className="relative max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      {/* Nút Back */}
      <button
        onClick={() => navigate(-1)}
        className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-2"
      >
        <span className="text-lg">←</span> Back
      </button>

      {/* Tiêu đề */}
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Create Room
      </h2>

      {/* Thông báo lỗi */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Form */}
      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* Room Name */}
        <div>
          <label
            htmlFor="roomName"
            className="block text-gray-700 font-medium mb-1"
          >
            Room Name
          </label>
          <input
            type="text"
            id="roomName"
            placeholder="e.g., Spinning Room"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            required
            onChange={(e) => setRoomName(e.target.value)}
          />
        </div>

        {/* Room Type */}
        <div>
          <label
            htmlFor="roomType"
            className="block text-gray-700 font-medium mb-1"
          >
            Room Type
          </label>
          <select
            name="roomType"
            id="roomType"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            required
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
          >
            <option value="">Select Room Type</option>
            <option value="10">Cardio</option>
            <option value="20">Strength</option>
            <option value="30">CrossFit</option>
            <option value="40">Yoga</option>
            <option value="50">Pilates</option>
            <option value="60">Boxing</option>
            <option value="70">Spinning</option>
            <option value="80">Functional</option>
            <option value="90">Dance</option>
            <option value="100">Personal Training</option>
            <option value="110">Recovery</option>
            <option value="120">Multipurpose</option>
          </select>
        </div>

        {/* Room Number */}
        <div>
          <label
            htmlFor="roomNumber"
            className="block text-gray-700 font-medium mb-1"
          >
            Room Number
          </label>
          <input
            type="number"
            id="roomNumber"
            placeholder="e.g., 101"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            required
            onChange={(e) => setRoomNumber(e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
          >
            Create Room
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddRoom;
