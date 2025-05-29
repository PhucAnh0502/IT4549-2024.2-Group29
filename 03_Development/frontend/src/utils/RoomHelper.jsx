 import axios from "axios";

const API_PATH = import.meta.env.VITE_API_PATH;

export const getAllRooms = async () => {
  let rooms;
  try {
    const response = await axios.get(`${API_PATH}/Room/all-room`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (response) {
      rooms = response.data.$values;
    }
  } catch (err) {
    alert(err.response.data.message);
  }
  return rooms;
};



