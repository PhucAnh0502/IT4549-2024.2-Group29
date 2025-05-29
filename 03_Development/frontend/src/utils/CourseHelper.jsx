import axios from "axios"; 

const API_PATH = import.meta.env.VITE_API_PATH;

export const getAllCourses = async () => {
  let courses;
  try {
    const response = await axios.get(`${API_PATH}/Course/all`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (response) {
      courses = response.data.$values;
    }
  } catch (err) {
    alert(err.response.data.message);
  }
  return courses;
};

export const getRegisteredCourses = async () => {
  let registeredCourses;
  try {
    const response = await axios.get(`${API_PATH}/Course/registered`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (response) {
      registeredCourses = response.data.$values;
    }
  } catch (err) {
    alert(err.response.data.message);
  }
  return registeredCourses;
};
