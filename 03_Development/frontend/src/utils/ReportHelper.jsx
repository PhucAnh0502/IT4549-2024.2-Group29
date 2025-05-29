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
      reports = response.data.$values;
    }
  } catch (err) {
    alert(err.response.data.message);
  }
  return reports;
};


