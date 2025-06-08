import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddEquipment = () => {
  const navigate = useNavigate();
  const [equipmentTypes, setEquipmentTypes] = useState([]);
  const [roomCodes, setRoomCodes] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    deviceType: "",
    manufacturer: "",
    dateOfPurchase: "",
    warrantyPeriod: 0,
    rentalFee: 0,
    roomCode: "",
  });
  const [selectedRoomType, setSelectedRoomType] = useState("");

  const API_PATH = import.meta.env.VITE_API_PATH;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "dateOfPurchase"
          ? new Date(`${value}T00:00:00Z`).toISOString()
          : value,
    }));
  };

  const getEquipmentTypes = async () => {
    try {
      const response = await axios.get(
        `${API_PATH}/Device/device-by-room-type/${selectedRoomType}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response) {
        setEquipmentTypes(response.data);
      }
    } catch (err) {
      alert(err.response.data.Message || "Cannot get equipment type");
    }
  };

  const getRoomCodes = async () => {
    try {
      const response = await axios.get(
        `${API_PATH}/Room/room-code/${selectedRoomType}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response) {
        setRoomCodes(response.data);
      }
    } catch (err) {
      alert(err.response.data.Message || "Cannot get room code");
    }
  };

  useEffect(() => {
    if (selectedRoomType !== "") {
      getEquipmentTypes();
      getRoomCodes();
    }
  }, [selectedRoomType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_PATH}/Device/add-device`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert(response.data.message);
      setFormData({
        name: "",
        deviceType: "",
        manufacturer: "",
        dateOfPurchase: "",
        warrantyPeriod: 0,
        rentalFee: 0,
        roomCode: "",
      });
    } catch (err) {
      alert(err.response.data.Message);
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md space-y-4 mt-10"
    >
      <div className="flex items-center justify-between mb-6 relative">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-2"
        >
          <span className="text-lg">←</span> Back
        </button>
        <div className="w-full text-center">
          <h2 className="text-3xl font-bold text-red-600">Add New Equipment</h2>
        </div>
      </div>

      <div>
        <label className="block font-medium mb-1">Name</label>
        <input
          type="text"
          name="name"
          className="w-full px-4 py-2 border rounded-lg"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Room Type</label>
        <select
          name="roomType"
          className="w-full px-4 py-2 border rounded-lg"
          value={selectedRoomType}
          onChange={(e) => setSelectedRoomType(e.target.value)}
          required
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

      <div>
        <label className="block font-medium mb-1">Equipment Type</label>
        <select
          name="deviceType"
          className="w-full px-4 py-2 border rounded-lg"
          value={formData.deviceType}
          onChange={handleChange}
          required
        >
          <option value="">Select Equipment Type</option>
          {equipmentTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-medium mb-1">Manufacturer</label>
        <input
          type="text"
          name="manufacturer"
          className="w-full px-4 py-2 border rounded-lg"
          value={formData.manufacturer}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Date of Purchase</label>
        <input
          type="date"
          name="dateOfPurchase"
          className="w-full px-4 py-2 border rounded-lg"
          value={formData.dateOfPurchase?.split("T")[0]}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label className="block font-medium mb-1">
          Warranty Period (months)
        </label>
        <input
          type="number"
          name="warrantyPeriod"
          className="w-full px-4 py-2 border rounded-lg"
          value={formData.warrantyPeriod}
          onChange={handleChange}
          min={0}
          required
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Rental Fee</label>
        <input
          type="number"
          name="rentalFee"
          className="w-full px-4 py-2 border rounded-lg"
          value={formData.rentalFee}
          onChange={handleChange}
          min={0}
          required
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Room Code</label>
        <select
          name="roomCode"
          className="w-full px-4 py-2 border rounded-lg"
          value={formData.roomCode}
          onChange={handleChange}
          required
        >
          <option value="">Select Room</option>
          {roomCodes.map((code) => (
            <option key={code} value={code}>
              {code}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
      >
        Add Equipment
      </button>
    </form>
  );
};

export default AddEquipment;
