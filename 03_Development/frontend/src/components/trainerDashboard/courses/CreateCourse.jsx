import React, { useState } from "react";
import {
  BookOpen,
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  Plus,
  ArrowLeft,
  Tag,
  AlignLeft
} from "lucide-react";

const CreateCourse = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    type: "",
    price: 0,
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    roomId: "",
    trainingDays: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleMultiChange = (e) => {
    const value = [...e.target.selectedOptions].map((o) => o.value);
    setForm({ ...form, trainingDays: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
        await createCourse(form); 
        alert("Course created successfully"); 
        navigate("/trainer-dashboard/my-courses"); 
    } catch (error) {
        alert(error?.response?.data?.message || "Failed to create course");
    }
    };

  const handleBack = () => {
    console.log("Navigate back");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors duration-300"
              >
                <ArrowLeft className="text-lg" />
                <span>Back</span>
              </button>
              <div className="h-8 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-3">
                <div className="bg-red-500 p-3 rounded-lg">
                  <BookOpen className="text-white text-xl" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Create New Course</h1>
                  <p className="text-gray-600">Fill in the details to create a new training course</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
                      <div onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center space-x-2">
                <BookOpen className="text-red-500" />
                <span>Basic Information</span>
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Name
                  </label>
                  <div className="relative">
                    <input
                      name="name"
                      placeholder="Enter course name"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-300"
                      required
                    />
                    <BookOpen className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <div className="relative">
                    <textarea
                      name="description"
                      placeholder="Enter course description"
                      value={form.description}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-300 resize-none"
                      required
                    />
                    <AlignLeft className="absolute left-4 top-4 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Type
                  </label>
                  <div className="relative">
                    <input
                      name="type"
                      placeholder="e.g. Cardio"
                      value={form.type}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-300"
                      required
                    />
                    <Tag className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (VND)
                  </label>
                  <div className="relative">
                    <input
                      name="price"
                      type="number"
                      placeholder="0"
                      value={form.price}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-300"
                      required
                    />
                    <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center space-x-2">
                <Calendar className="text-red-500" />
                <span>Schedule Information</span>
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <div className="relative">
                    <input
                      name="startDate"
                      type="date"
                      value={form.startDate}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-300"
                      required
                    />
                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <div className="relative">
                    <input
                      name="endDate"
                      type="date"
                      value={form.endDate}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-300"
                      required
                    />
                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time
                  </label>
                  <div className="relative">
                    <input
                      name="startTime"
                      type="time"
                      value={form.startTime}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-300"
                      required
                    />
                    <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Time
                  </label>
                  <div className="relative">
                    <input
                      name="endTime"
                      type="time"
                      value={form.endTime}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-300"
                      required
                    />
                    <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room ID
                  </label>
                  <div className="relative">
                    <input
                      name="roomId"
                      placeholder="Enter room ID"
                      value={form.roomId}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-300"
                      required
                    />
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Training Days
                  </label>
                  <select
                    multiple
                    name="trainingDays"
                    value={form.trainingDays}
                    onChange={handleMultiChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-300 h-32"
                    required
                  >
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                      <option key={day} value={day} className="py-2">
                        {day}
                      </option>
                    ))}
                  </select>
                  <p className="text-sm text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple days</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center space-x-2 shadow-lg ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Plus className="text-sm" />
                <span>{isSubmitting ? "Creating..." : "Create Course"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;