import axios from "axios";
const API_PATH = import.meta.env.VITE_API_PATH;

export const getAllReports = async () => {
  let reports;
  try {
    const response = await axios.get(`${API_PATH}/Report/all`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (response) {
      reports = response.data;
    }
  } catch (err) {
    alert(err.response.data.message);
  }
  return reports;
};

export const getMyReports = async () => {
  try {
    const response = await axios.get(`${API_PATH}/Report/my-reports`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (err) {
    console.error("GetMyReports Error:", err);
    return [];
  }
};

