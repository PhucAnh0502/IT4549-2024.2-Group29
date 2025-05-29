import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EquipmentInfo from "./EquipmentInfo";
import EquipmentDetailActions from "./EquipmentDetailActions";
import BookingForm from "./BookingForm";

const EquipmentDetail = () => {
  const { equipmentId } = useParams();
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState("");
  const [bookingData, setBookingData] = useState({
    from: "",
    to: "",
    bookingDate: "",
  });
  const API_PATH = import.meta.env.VITE_API_PATH;

  const splitCamelCase = (str) =>
    str
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2");

  const fetchEquipment = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_PATH}/Device/get-device-by-id/${equipmentId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setEquipment(response.data);
    } catch (err) {
      alert(err?.response?.data?.Message || "Failed to fetch equipment data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, [equipmentId]);

  const handleEnable = async () => {
    try {
      const response = await axios.post(
        `${API_PATH}/Device/enable-device/${equipment.id}`,
        { deviceId: equipment.id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert(response.data.message);
      fetchEquipment();
    } catch (err) {
      alert(err?.response?.data?.Message);
    }
  };

  const handleDisable = async () => {
    try {
      const response = await axios.post(
        `${API_PATH}/Device/disable-device/${equipment.id}`,
        { deviceId: equipment.id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert(response.data.message);
      fetchEquipment();
    } catch (err) {
      alert(err?.response?.data?.Message);
    }
  };

  const handleBook = () => {
    setIsBooking(true);
  };

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (equipment.status === "UnderMaintenance") {
      setError("This equipment is under maintenance!");
      return;
    }

    if (bookingData.to <= bookingData.from) {
      setError("To time must be after from time!");
      return;
    }

    try {
      setError("");
      const response = await axios.post(
        `${API_PATH}/Device/book-device`,
        {
          deviceId: equipment.id,
          userId: localStorage.getItem("userId"),
          from: `${bookingData.from}:00`,
          to: `${bookingData.to}:00`,
          bookingDate: bookingData.bookingDate,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert(response.data.message);
      setIsBooking(false);
      fetchEquipment();
    } catch (err) {
      if (err?.response?.data?.Message) {
        setError(err.response.data.Message);
      }
    }
  };

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
          <h2 className="text-3xl font-bold text-red-600">
            {splitCamelCase(equipment.name)}
          </h2>
        </div>
      </div>

      <EquipmentInfo equipment={equipment} splitCamelCase={splitCamelCase} />

      <EquipmentDetailActions
        navigate={navigate}
        equipment={equipment}
        onBook={handleBook}
        onEnable={handleEnable}
        onDisable={handleDisable}
      />

      {isBooking && (
        <BookingForm
          bookingData={bookingData}
          onChange={handleBookingChange}
          onSubmit={handleBookingSubmit}
          error={error}
          onCancel={() => setIsBooking(false)}
        />
      )}
    </div>
  );
};

export default EquipmentDetail;
