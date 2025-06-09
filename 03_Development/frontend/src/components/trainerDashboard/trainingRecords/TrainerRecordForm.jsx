import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  createTrainingRecord,
  updateTrainingRecord,
  getTrainingRecordById,
} from "../../../utils/TrainingRecordHelper";
import axios from "axios";

const TrainerRecordForm = ({ mode }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = mode === "edit";

  const [formData, setFormData] = useState({
    registeredCourseId: "",
    status: {
      Day1: { status: "", note: "" },
      Day2: { status: "", note: "" },
      Day3: { status: "", note: "" },
    },
    progress: 0,
  });

  const [availableCourses, setAvailableCourses] = useState([]);

  // Fetch existing record if editing
  useEffect(() => {
    if (isEdit && id) {
      (async () => {
        try {
          const record = await getTrainingRecordById(id);
          if (record) {
            setFormData({
              registeredCourseId: record.registeredCourseId || "",
              status: record.status || {
                Day1: { status: "", note: "" },
                Day2: { status: "", note: "" },
                Day3: { status: "", note: "" },
              },
              progress: record.progress || 0,
            });
          }
        } catch (error) {
          console.error("Failed to load training record:", error);
        }
      })();
    }
  }, [id, isEdit]);

  // Fetch trainer's courses (for create only)
  useEffect(() => {
    if (!isEdit) {
      (async () => {
        try {
          const token = localStorage.getItem("token");
          const payload = JSON.parse(atob(token.split(".")[1]));
          const trainerId = payload.userId;

          const url = `${import.meta.env.VITE_API_PATH}/Course/trainer/${trainerId}`;
          const res = await axios.get(url, {
            headers: { Authorization: `Bearer ${token}` },
          });

          setAvailableCourses(res.data || []);
        } catch (err) {
          console.error("Failed to fetch trainer's courses:", err);
        }
      })();
    }
  }, [isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [day, field] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        status: {
          ...prev.status,
          [day]: { ...prev.status[day], [field]: value },
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await updateTrainingRecord(id, {
          status: formData.status,
          progress: parseFloat(formData.progress),
        });
        alert("Training record updated.");
      } else {
        await createTrainingRecord({
          registeredCourseId: formData.registeredCourseId,
          status: formData.status,
          progress: parseFloat(formData.progress),
        });
        alert("Training record created.");
      }
      navigate("/trainer-dashboard/training-records");
    } catch (err) {
      console.error(err);
      alert("Error saving training record.");
    }
  };

  return (
    <div className="p-5 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        {isEdit ? "Edit" : "Create"} Training Record
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isEdit && (
          <div>
            <label className="block font-semibold">Registered Course</label>
            <select
              name="registeredCourseId"
              value={formData.registeredCourseId}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            >
              <option value="">-- Select a course --</option>
              {availableCourses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name || course.id}
                </option>
              ))}
            </select>
          </div>
        )}

        {["Day1", "Day2", "Day3"].map((day) => (
          <div key={day} className="border p-3 rounded">
            <h4 className="font-semibold">{day}</h4>
            <input
              type="text"
              name={`${day}.status`}
              placeholder="Status"
              value={formData.status?.[day]?.status || ""}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mb-2"
            />
            <input
              type="text"
              name={`${day}.note`}
              placeholder="Note"
              value={formData.status?.[day]?.note || ""}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        ))}

        <div>
          <label className="block font-semibold">Progress (%)</label>
          <input
            type="number"
            name="progress"
            value={formData.progress}
            onChange={handleChange}
            step="0.1"
            min="0"
            max="100"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {isEdit ? "Update" : "Create"}
        </button>
      </form>
    </div>
  );
};

export default TrainerRecordForm;
