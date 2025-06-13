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
    status: {},
    progress: 0,
  });

  const [availableCourses, setAvailableCourses] = useState([]);
  const [statusEntries, setStatusEntries] = useState([
    { id: 1, day: "Day 1" }
  ]);

  // Fetch existing record if editing
  useEffect(() => {
    if (isEdit && id) {
      (async () => {
        try {
          const record = await getTrainingRecordById(id);
          if (record) {
            // Chuyển đổi status từ API format sang frontend format
            const existingStatus = record.status || {};
            const entries = Object.keys(existingStatus).map((key, index) => ({
              id: index + 1,
              day: key
            }));
            
            setStatusEntries(entries.length > 0 ? entries : [{ id: 1, day: "Day 1" }]);
            setFormData({
              registeredCourseId: record.registeredCourseId || "",
              status: existingStatus,
              progress: record.progress || 0,
            });
          }
        } catch (error) {
          console.error("Failed to load training record:", error);
          alert("Failed to load training record");
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

          const url = `${import.meta.env.VITE_API_PATH}/Course/trainer/course/${trainerId}`;
          const res = await axios.get(url, {
            headers: { Authorization: `Bearer ${token}` },
          });

          setAvailableCourses(res.data || []);
        } catch (err) {
          console.error("Failed to fetch trainer's courses:", err);
          alert("Failed to fetch courses");
        }
      })();
    }
  }, [isEdit]);

  const addStatusEntry = () => {
    const newId = Math.max(...statusEntries.map(entry => entry.id)) + 1;
    const newDay = `Day ${statusEntries.length + 1}`;
    setStatusEntries([...statusEntries, { id: newId, day: newDay }]);
    
    // Initialize empty status for new entry
    setFormData(prev => ({
      ...prev,
      status: {
        ...prev.status,
        [newDay]: { status: "", note: "" }
      }
    }));
  };

  const removeStatusEntry = (entryId) => {
    if (statusEntries.length <= 1) return; // Keep at least one entry
    
    const entryToRemove = statusEntries.find(entry => entry.id === entryId);
    const updatedEntries = statusEntries.filter(entry => entry.id !== entryId);
    setStatusEntries(updatedEntries);
    
    // Remove from formData status
    const updatedStatus = { ...formData.status };
    delete updatedStatus[entryToRemove.day];
    setFormData(prev => ({
      ...prev,
      status: updatedStatus
    }));
  };

  const updateDayName = (entryId, newDay) => {
    const oldEntry = statusEntries.find(entry => entry.id === entryId);
    const oldDay = oldEntry.day;
    
    // Update entries
    setStatusEntries(prev => prev.map(entry => 
      entry.id === entryId ? { ...entry, day: newDay } : entry
    ));
    
    // Update formData status
    if (oldDay !== newDay) {
      const updatedStatus = { ...formData.status };
      if (updatedStatus[oldDay]) {
        updatedStatus[newDay] = updatedStatus[oldDay];
        delete updatedStatus[oldDay];
      } else {
        updatedStatus[newDay] = { status: "", note: "" };
      }
      setFormData(prev => ({
        ...prev,
        status: updatedStatus
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [day, field] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        status: {
          ...prev.status,
          [day]: { 
            ...prev.status[day], 
            [field]: value 
          },
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    if (!isEdit && !formData.registeredCourseId) {
      alert("Please select a course");
      return false;
    }

    // Validate that all status entries have at least a status
    for (const entry of statusEntries) {
      const statusData = formData.status[entry.day];
      if (!statusData || !statusData.status.trim()) {
        alert(`Please fill in the status for ${entry.day}`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Prepare data according to API format
      const submitData = {
        registeredCourseId: formData.registeredCourseId,
        status: formData.status,
        progress: parseFloat(formData.progress) || 0,
      };

      if (isEdit) {
        // For update, only send status and progress
        await updateTrainingRecord(id, {
          status: submitData.status,
          progress: submitData.progress,
        });
        alert("Training record updated successfully!");
      } else {
        // For create, send all data
        console.log(submitData)
        await createTrainingRecord(submitData);
        alert("Training record created successfully!");
      }
      
      navigate("/trainer-dashboard/training-records");
    } catch (err) {
      console.error("Error saving training record:", err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.Message || 
                          "Error saving training record";
      alert(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-indigo-600 px-8 py-6">
            <h2 className="text-3xl font-bold text-white">
              {isEdit ? "✏️ Edit" : "📝 Create"} Training Record
            </h2>
            <p className="text-red-100 mt-2">
              {isEdit ? "Update existing training record" : "Add a new training record to track progress"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Course Selection - Only show in create mode */}
            {!isEdit && (
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <label className="block text-lg font-semibold text-gray-700 mb-3">
                  📚 Select Course *
                </label>
                <select
                  name="registeredCourseId"
                  value={formData.registeredCourseId}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200"
                >
                  <option value="">-- Select a course --</option>
                  {availableCourses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.course.name || course.title || `Course ${course.id}`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Status Entries */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-700">
                  📋 Training Status & Notes *
                </h3>
                <button
                  type="button"
                  onClick={addStatusEntry}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                >
                  <span className="text-lg">+</span>
                  Add Day
                </button>
              </div>

              <div className="space-y-4">
                {statusEntries.map((entry) => (
                  <div key={entry.id} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <input
                        type="text"
                        value={entry.day}
                        onChange={(e) => updateDayName(entry.id, e.target.value)}
                        className="text-lg font-semibold bg-transparent border-b-2 border-gray-300 focus:border-red-500 outline-none px-2 py-1"
                        placeholder="Day name"
                        required
                      />
                      {statusEntries.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeStatusEntry(entry.id)}
                          className="text-red-500 hover:text-red-700 text-xl font-bold transition-colors duration-200 p-2"
                          title="Remove this day"
                        >
                          ×
                        </button>
                      )}
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          Status *
                        </label>
                        <input
                          type="text"
                          name={`${entry.day}.status`}
                          placeholder="e.g., Completed, In Progress, Pending"
                          value={formData.status?.[entry.day]?.status || ""}
                          onChange={handleChange}
                          required
                          className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          Notes
                        </label>
                        <textarea
                          name={`${entry.day}.note`}
                          placeholder="Add any notes or comments..."
                          value={formData.status?.[entry.day]?.note || ""}
                          onChange={handleChange}
                          rows="3"
                          className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200 resize-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                📊 Overall Progress
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  name="progress"
                  value={formData.progress}
                  onChange={handleChange}
                  step="0.1"
                  min="0"
                  max="100"
                  className="w-32 border-2 border-gray-300 rounded-lg px-4 py-3 text-lg font-semibold focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200"
                />
                <span className="text-lg font-medium text-gray-600">%</span>
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-red-500 to-green-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(0, formData.progress))}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-500 w-12">
                  {Math.round(formData.progress)}%
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate("/trainer-dashboard/training-records")}
                className="mr-4 px-6 py-3 text-gray-600 border-2 border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-red-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-red
                -700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                {isEdit ? "💾 Update Record" : "✨ Create Record"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TrainerRecordForm;
