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
      courses = response.data;
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
      registeredCourses = response.data;
    }
  } catch (err) {
    alert(err.response.data.message);
  }
  return registeredCourses;
};

export const deleteCourse = async (courseId) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.delete(`${API_PATH}/Course/${courseId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCoursesByTrainerId = async (trainerId) => {
  try {
    const response = await axios.get(`${API_PATH}/Course/trainer/${trainerId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createCourse = async (courseData) => {
  const response = await axios.post(`${API_PATH}/Course/create`, courseData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
};

export const updateCourse = async (courseId, updatedData) => {
  try {
    const response = await axios.put(`${API_PATH}/Course/${courseId}`, updatedData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (err) {
    alert(err.response?.data?.message || "Failed to update course");
    throw err;
  }
};
