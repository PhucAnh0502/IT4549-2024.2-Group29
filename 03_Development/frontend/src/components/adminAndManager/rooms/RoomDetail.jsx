import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EquipmentTable from "./EquipmentTable";
import RoomInfo from "./RoomInfo";

const RoomDetail = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_PATH = import.meta.env.VITE_API_PATH;

  useEffect(() => {
    const fetchRoom = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_PATH}/Room/room/${roomId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setRoom(response.data);
      } catch (err) {
        alert(err?.response?.data?.Message || "Failed to fetch room data.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomId]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-500 rounded-full animate-spin border-t-transparent mb-4"></div>
          <p className="text-lg font-semibold text-red-500 animate-pulse">
            Loading...
          </p>
        </div>
      </div>
    );
  if (!room) return null;

  const devices = room.devices || [];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-2 mb-4"
      >
        <span className="text-lg">←</span> Back
      </button>

      <RoomInfo room={room} />
      <EquipmentTable devices={devices} />
    </div>
  );
};

export default RoomDetail;
