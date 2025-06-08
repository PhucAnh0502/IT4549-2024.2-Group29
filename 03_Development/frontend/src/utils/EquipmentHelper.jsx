import axios from "axios";

const API_PATH = import.meta.env.VITE_API_PATH;

export const getAllEquipments = async () => {
  let equipments;
  try {
    const response = await axios.get(`${API_PATH}/Device/get-devices`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (response) {
      equipments = response.data;
    }
  } catch (err) {
    alert(err.response.data.message);
  }
  return equipments;
};

export const getRoomById = async (roomId) => {
  let room;
  try {
    const response = await axios.get(`${API_PATH}/Room/room/${roomId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if(response.data){
      room = response.data
    }
  } catch (err) {
    alert(err?.response?.data?.Message || "Failed to fetch room data.");
  }
  return room
}

export const getBookingbyUserId = async (userId) => {
  try {
    const response = await axios.get(`${API_PATH}/Device/getbooking-by-user/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (err) {
    alert(err?.response?.data?.Message || "Failed to fetch booking data.");
    return null;
  }
}

export const getEquipmentById = async (equipmentId) => {
  let equipment;
  try {
    const response = await axios.get(`${API_PATH}/Device/get-device-by-id/${equipmentId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if(response.data){
      equipment = response.data
    }
    return equipment;
  } catch (err) { 
    alert(err?.response?.data?.Message || "Failed to fetch equipment data.");
    return null;
  }
}
