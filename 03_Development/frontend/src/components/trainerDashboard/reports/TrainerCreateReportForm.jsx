import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaSave, FaArrowLeft, FaTimes } from "react-icons/fa";

const TrainerCreateReportForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    reportType: "",
    content: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const API_PATH = import.meta.env.VITE_API_PATH;
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Enum values matching backend
  const REPORT_TYPES = [
    { value: 0, label: "Equipment" },
    { value: 1, label: "User" },
    { value: 2, label: "Training Record" },
    { value: 3, label: "Course" },
    { value: 4, label: "Room" },
    { value: 5, label: "Environment" },
    { value: 6, label: "Other" }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters long";
    }

    if (formData.reportType === "") {
      newErrors.reportType = "Report type is required";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
    } else if (formData.content.trim().length < 10) {
      newErrors.content = "Content must be at least 10 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: formData.title.trim(),
        reportType: parseInt(formData.reportType),
        content: formData.content.trim()
      };
      console.log("Payload gửi:", payload);

      await axios.post(`${API_PATH}/Report/create`, payload, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      alert("Report created successfully!");
      navigate("/trainer-dashboard/reports");
    } catch (error) {
      console.error("Error creating report:", error);
      if (error.response?.status === 401) {
        alert("Your session has expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else if (error.response?.status === 400) {
        const errorMessage = error.response.data?.message || "Invalid data provided";
        alert(`Failed to create report: ${errorMessage}`);
      } else {
        alert("Failed to create report. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (formData.title || formData.content || formData.reportType !== "") {
      if (window.confirm("Are you sure you want to cancel? All unsaved changes will be lost.")) {
        navigate("/trainer-dashboard/reports");
      }
    } else {
      navigate("/trainer-dashboard/reports");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/trainer-dashboard/reports")}
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                <FaArrowLeft size={20} />
              </button>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Create New Report</h2>
                <p className="text-gray-600 text-sm mt-1">Submit a new report for review</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title Field */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Report Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter a descriptive title for your report"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
              </div>

              {/* Report Type Field */}
              <div>
                <label htmlFor="reportType" className="block text-sm font-medium text-gray-700 mb-2">
                  Report Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="reportType"
                  name="reportType"
                  value={formData.reportType}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.reportType ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select report type</option>
                  {REPORT_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.reportType && (
                  <p className="mt-1 text-sm text-red-600">{errors.reportType}</p>
                )}
              </div>

              {/* Content Field */}
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                  Report Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows={8}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical ${
                    errors.content ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Describe the issue or situation in detail. Include relevant information such as when it occurred, what was affected, and any steps you've already taken."
                />
                {errors.content && (
                  <p className="mt-1 text-sm text-red-600">{errors.content}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  Minimum 10 characters ({formData.content.length}/10)
                </p>
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <FaSave />
                      Create Report
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  <FaTimes />
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-800 mb-2">Reporting Guidelines</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Provide a clear and descriptive title</li>
            <li>• Select the most appropriate report type</li>
            <li>• Include detailed information about the issue</li>
            <li>• Mention when and where the issue occurred</li>
            <li>• Include any relevant context or background information</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TrainerCreateReportForm;