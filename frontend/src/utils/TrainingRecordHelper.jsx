import axios from "axios";

const API_PATH = import.meta.env.VITE_API_PATH

export const getAllTrainingRecords = async () => {
    let records;
    try {
        const response = await axios.get(`${API_PATH}/TrainingRecord/all-training-records`,{
            headers : {
                Authorization : `Bearer ${localStorage.getItem('token')}`
            }
        })
        if(response.data.$values) {
            records = response.data.$values
        }
    } catch (err) {
        records = []
        console.log(err.response.data.Message)
    }
    return records
}
  