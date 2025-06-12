import axios from "axios";

const API_PATH = import.meta.env.VITE_API_PATH;
const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`
});

export const createTrainingRecord = async (data) => {
  try {
    const response = await axios.post(`${API_PATH}/TrainingRecord/create`, data, {
      headers: authHeader()
    });
    return response.data;
  } catch (err) {
    console.error("Create failed:", err.response?.data?.Message || err.message);
    throw err;
  }
};

export const getTrainingRecordById = async (id) => {
  try {
    const response = await axios.get(`${API_PATH}/TrainingRecord/${id}`, {
      headers: authHeader()
    });
    return response.data;
  } catch (err) {
    console.error("Get by ID failed:", err.response?.data?.Message || err.message);
    throw err;
  }
};

export const updateTrainingRecord = async (id, data) => {
  try {
    const response = await axios.put(`${API_PATH}/TrainingRecord/${id}`, data, {
      headers: authHeader()
    });
    return response.data;
  } catch (err) {
    console.error("Update failed:", err.response?.data?.Message || err.message);
    throw err;
  }
};

export const deleteTrainingRecord = async (id) => {
  try {
    const response = await axios.delete(`${API_PATH}/TrainingRecord/${id}`, {
      headers: authHeader()
    });
    return response.data;
  } catch (err) {
    console.error("Delete failed:", err.response?.data?.message || err.message);
    throw err;
  }
};

export const getTrainingRecordsForTrainer = async (trainerId) => {
  try {
    const courseRes = await axios.get(`${API_PATH}/TrainingRecord/trainer/${trainerId}`, {
      headers: authHeader()
    });

    const registeredCourses = courseRes.data || [];
    
    return registeredCourses
  } catch (err) {
    console.error("Trainer fetch failed:", err.response?.data?.message || err.message);
    return [];
  }
};

export const getAllTrainingRecords = async () => {
    let records;
    try {
        const response = await axios.get(`${API_PATH}/TrainingRecord/all-training-records`,{
            headers : {
                Authorization : `Bearer ${localStorage.getItem('token')}`
            }
        })
        if(response.data) {
            records = response.data
        }
    } catch (err) {
        records = []
        console.log(err.response.data.Message)
    }
    return records
}
  