import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { FaSave, FaArrowLeft, FaTimes } from "react-icons/fa";
import {jwtDecode} from "jwt-decode";

const EditReportForm = () => {
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    reportType: "",
    content: ""
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [originalData, setOriginalData] = useState({});
  
  const API_PATH = import.meta.env.VITE_API_PATH;
  const navigate = useNavigate();
  const { reportId } = useParams();
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

  const fetchReport = async () => {
    setFetchLoading(true);
    try {
      const response = await axios.get(`${API_PATH}/Report/${reportId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const report = response.data;
      const reportData = {
        id: report.id,
        title: report.title,
        reportType: report.reportType.toString(),
        content: report.content
      };
      setFormData(reportData);
      setOriginalData(reportData);
    } catch (error) {
      console.error("Error fetching report:", error);
      if (error.response?.status === 401) {
        alert("Your session has expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else if (error.response?.status === 403) {
        alert("You don't have permission to edit this report.");
        navigate("/trainer-dashboard/reports");
      } else if (error.response?.status === 404) {
        alert("Report not found.");
        navigate("/trainer-dashboard/reports");
      } else {
        alert("Failed to load report. Please try again.");
        navigate("/trainer-dashboard/reports");
      }
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    if (reportId) {
      fetchReport();
    }
  }, [reportId]);

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

    // Check if data has changed
    const hasChanges = Object.keys(formData).some(key => 
      formData[key] !== originalData[key]
    );

    if (!hasChanges) {
      alert("No changes detected.");
      return;
    }

    setLoading(true);
    
    try {
      const updateData = {
        id: formData.id,
        title: formData.title.trim(),
        reportType: parseInt(formData.reportType),
        content: formData.content.trim()
      };

      await axios.put(`${API_PATH}/Report`, updateData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      alert("Report updated successfully!");
      navigate("/trainer-dashboard/my-reports");
      
    } catch (error) {
      console.error("Error updating report:", error);
      
      if (error.response?.status === 401) {
        alert("Your session has expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else if (error.response?.status === 403) {
        alert("You don't have permission to edit this report.");
      } else if (error.response?.status === 404) {
        alert("Report not found.");
        navigate("/trainer-dashboard/my-reports");
      } else if (error.response?.status === 400) {
        alert("Invalid data. Please check your input and try again.");
      } else {
        alert("Failed to update report. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    const hasChanges = Object.keys(formData).some(key => 
      formData[key] !== originalData[key]
    );

    if (hasChanges) {
      if (window.confirm("You have unsaved changes. Are you sure you want to leave?")) {
        navigate("/trainer-dashboard/my-reports");
      }
    } else {
      navigate("/trainer-dashboard/my-reports");
    }
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all changes?")) {
      setFormData(originalData);
      setErrors({});
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading report...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Report</h1>
                <p className="mt-1 text-sm text-gray-600">
                  Update your report information
                </p>
              </div>
              <button
                onClick={handleCancel}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FaArrowLeft className="mr-2 h-4 w-4" />
                Back to My Reports
              </button>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Title Field */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Report Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter report title"
                maxLength={200}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                {formData.title.length}/200 characters
              </p>
            </div>

            {/* Report Type Field */}
            <div>
              <label htmlFor="reportType" className="block text-sm font-medium text-gray-700 mb-2">
                Report Type *
              </label>
              <select
                id="reportType"
                name="reportType"
                value={formData.reportType}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.reportType ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select report type</option>
                {REPORT_TYPES.map((type) => (
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
                Report Content *
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={8}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.content ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter detailed report content..."
                maxLength={2000}
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">{errors.content}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                {formData.content.length}/2000 characters
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  <FaTimes className="mr-2 h-4 w-4" />
                  Reset Changes
                </button>
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <FaSave className="mr-2 h-4 w-4" />
                      Update Report
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditReportForm;