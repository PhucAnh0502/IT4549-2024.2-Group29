import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const CourseDetail = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const API_PATH = import.meta.env.VITE_API_PATH;

  useEffect(() => {
    const fetchRoom = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_PATH}/Course/${courseId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setCourse(response.data);
      } catch (err) {
        alert(err?.response?.data?.Message || "Failed to fetch course data.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [courseId]);

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

  if (!course) return <p>No course data available.</p>;
  return (
    <div className="max-w-5xl mx-auto p-8 bg-white shadow-xl rounded-2xl mt-20 mb-20">
      <div className="flex items-center justify-between mb-6 relative">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-2"
        >
          <span className="text-lg">←</span> Back
        </button>
        <div className="w-full text-center">
          <h2 className="text-3xl font-bold text-red-600">{course.name}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-2">
          <p>
            <span className="font-semibold text-gray-700">Description:</span>{" "}
            {course.description}
          </p>
          <p>
            <span className="font-semibold text-gray-700">Type:</span>{" "}
            {course.type}
          </p>
          <p>
            <span className="font-semibold text-gray-700">Status:</span>{" "}
            {course.status}
          </p>
          <p>
            <span className="font-semibold text-gray-700">Start Date:</span>{" "}
            {new Date(course.startDate).toLocaleDateString("vi-VN")}
          </p>
          <p>
            <span className="font-semibold text-gray-700">End Date:</span>{" "}
            {new Date(course.endDate).toLocaleDateString("vi-VN")}
          </p>
          <p>
            <span className="font-semibold text-gray-700">Start Time:</span>{" "}
            {course.startTime.slice(0, 5)}
          </p>
          <p>
            <span className="font-semibold text-gray-700">End Time:</span>{" "}
            {course.endTime.slice(0, 5)}
          </p>
          <p>
            <span className="font-semibold text-gray-700">Training Days:</span>{" "}
            {course.trainingDaysString}
          </p>
          <p>
            <span className="font-semibold text-gray-700">Price:</span>{" "}
            {course.price.toLocaleString()}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="bg-gray-100 p-4 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              Room Info
            </h3>
            <p>
              <strong>Code:</strong> {course?.room?.roomCode}
            </p>
            <p>
              <strong>Name:</strong> {course?.room?.name}
            </p>
            <p>
              <strong>Type:</strong> {course?.room?.roomType}
            </p>
            <p>
              <strong>Capacity:</strong> {course?.room?.capacity}
            </p>
            <p>
              <strong>Status:</strong> {course?.room?.status}
            </p>
          </div>

          <div className="bg-gray-100 p-4 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              Trainer Info
            </h3>
            <p>
              <strong>Name:</strong> {course?.trainer?.firstName}{" "}
              {course?.trainer?.lastName}
            </p>
            <p>
              <strong>Specialization:</strong> {course?.trainer?.specialization}
            </p>
            <p>
              <strong>DOB:</strong>{" "}
              {new Date(course?.trainer?.dateOfBirth).toLocaleDateString(
                "vi-VN"
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
