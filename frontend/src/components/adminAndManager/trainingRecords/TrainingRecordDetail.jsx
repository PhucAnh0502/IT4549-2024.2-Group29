import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProgressBar from "./ProgressBar";

const TrainingRecordDetail = () => {
  const { trainingRecordId } = useParams();
  const navigate = useNavigate();
  const [trainingRecord, setTrainingRecord] = useState({});
  const [loading, setLoading] = useState(false);

  const API_PATH = import.meta.env.VITE_API_PATH;

  const getTrainingRecord = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_PATH}/TrainingRecord/${trainingRecordId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response) {
        setTrainingRecord(response.data);
      }
    } catch (err) {
      alert(err.response.data.Message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTrainingRecord();
  }, []);

  if (loading) {
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
  }

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
            Training Record Detail
          </h2>
        </div>
      </div>

      <div className="space-y-4 text-gray-700">
        <ProgressBar progress={trainingRecord.progress} width={608}/>

        <div>
          <p className="font-semibold mb-2">Status by Date:</p>
          <div className="space-y-2">
            {trainingRecord.status ? (
              Object.entries(trainingRecord.status)
                .filter(([key]) => key !== "$id") 
                .map(([date, info]) => (
                  <div
                    key={date}
                    className="border p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
                  >
                    <p>
                      <span className="font-semibold">Date:</span> {date}
                    </p>
                    <p>
                      <span className="font-semibold">Status:</span>{" "}
                      {info.status}
                    </p>
                    <p>
                      <span className="font-semibold">Note:</span> {info.note}
                    </p>
                  </div>
                ))
            ) : (
              <p>No status available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingRecordDetail;
