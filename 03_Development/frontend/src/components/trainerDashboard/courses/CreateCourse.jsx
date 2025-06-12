import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  BookOpen,
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  Plus,
  ArrowLeft,
  Tag,
  AlignLeft,
} from "lucide-react";

const CreateCourse = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    type: 0,
    price: 0,
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    roomName: "",
    trainingDays: [],
  });

  const dayNameToEnum = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleMultiChange = (e) => {
    const selectedDays = [...e.target.selectedOptions].map((o) => o.value);
    setForm((prev) => ({ ...prev, trainingDays: selectedDays }));
    if (errors.trainingDays) {
      setErrors((prev) => ({ ...prev, trainingDays: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Tên khóa học là bắt buộc";
    }

    if (!form.description.trim()) {
      newErrors.description = "Mô tả khóa học là bắt buộc";
    }

    if (!form.type) {
      newErrors.type = "Vui lòng chọn loại khóa học.";
    }

    if (form.price <= 0) {
      newErrors.price = "Giá khóa học phải lớn hơn 0";
    }

    if (!form.startDate) {
      newErrors.startDate = "Ngày bắt đầu là bắt buộc";
    }

    if (!form.endDate) {
      newErrors.endDate = "Ngày kết thúc là bắt buộc";
    }

    if (
      form.startDate &&
      form.endDate &&
      new Date(form.startDate) >= new Date(form.endDate)
    ) {
      newErrors.endDate = "Ngày kết thúc phải sau ngày bắt đầu";
    }

    if (!form.startTime) {
      newErrors.startTime = "Giờ bắt đầu là bắt buộc";
    }

    if (!form.endTime) {
      newErrors.endTime = "Giờ kết thúc là bắt buộc";
    }

    if (form.startTime && form.endTime && form.startTime >= form.endTime) {
      newErrors.endTime = "Giờ kết thúc phải sau giờ bắt đầu";
    }

    if (!form.roomName.trim()) {
      newErrors.roomName = "Room Name là bắt buộc";
    }

    if (form.trainingDays.length === 0) {
      newErrors.trainingDays = "Vui lòng chọn ít nhất một ngày tập luyện";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createCourse = async (courseData) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_PATH}/Course/create`,
      courseData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const processedForm = {
        name: form.name,
        description: form.description,
        startDate: new Date(form.startDate).toISOString(),
        endDate: new Date(form.endDate).toISOString(),
        startTime:
          form.startTime.length === 5 ? `${form.startTime}:00` : form.startTime, // HH:mm:ss
        endTime:
          form.endTime.length === 5 ? `${form.endTime}:00` : form.endTime,
        price: parseFloat(form.price),
        type: parseInt(form.type),
        roomName: form.roomName,
        trainingDays: form.trainingDays.map((day) => dayNameToEnum[day]), // 0 - 6
      };

      console.log("Dữ liệu gửi lên:", JSON.stringify(processedForm, null, 2));
      await createCourse(processedForm);

      alert("Tạo khóa học thành công!");
      navigate("/trainer-dashboard/my-courses");
    } catch (error) {
      console.error("Create course error:", error);
      const errorMessage =
        error?.response?.data?.Message ||
        error?.response?.data?.errors?.[0] ||
        "Không thể tạo khóa học. Vui lòng thử lại.";
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (
      window.confirm(
        "Bạn có chắc chắn muốn quay lại? Dữ liệu đã nhập sẽ bị mất."
      )
    ) {
      navigate("/trainer-dashboard/my-courses");
    }
  };

  const dayTranslations = {
    Monday: "Thứ 2",
    Tuesday: "Thứ 3",
    Wednesday: "Thứ 4",
    Thursday: "Thứ 5",
    Friday: "Thứ 6",
    Saturday: "Thứ 7",
    Sunday: "Chủ nhật",
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
                <span>Quay lại</span>
              </button>
              <div className="h-8 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-3">
                <div className="bg-red-500 p-3 rounded-lg">
                  <BookOpen className="text-white text-xl" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    Tạo khóa học mới
                  </h1>
                  <p className="text-gray-600">
                    Điền đầy đủ thông tin để tạo khóa học đào tạo
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center space-x-2">
                <BookOpen className="text-red-500" />
                <span>Thông tin cơ bản</span>
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên khóa học <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      name="name"
                      placeholder="Nhập tên khóa học"
                      value={form.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 pl-12 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-300 ${
                        errors.name ? "border-red-500" : "border-gray-300"
                      }`}
                      required
                    />
                    <BookOpen className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <textarea
                      name="description"
                      placeholder="Nhập mô tả khóa học"
                      value={form.description}
                      onChange={handleChange}
                      rows={4}
                      className={`w-full px-4 py-3 pl-12 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-300 resize-none ${
                        errors.description
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      required
                    />
                    <AlignLeft className="absolute left-4 top-4 text-gray-400" />
                  </div>
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.description}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loại khóa học <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="type"
                      //value={form.type}
                      onChange={(e) =>
                        setForm({ ...form, type: e.target.value })
                      }
                      className={`w-full px-4 py-3 pl-12 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-300 ${
                        errors.type ? "border-red-500" : "border-gray-300"
                      }`}
                      required
                    >
                      <option value="">-- Chọn loại khóa học --</option>
                      <option value="10">Cardio</option>
                      <option value="20">Strength</option>
                      <option value="30">CrossFit</option>
                      <option value="40">Yoga</option>
                      <option value="50">Pilates</option>
                      <option value="60">Boxing</option>
                      <option value="70">Spinning</option>
                      <option value="80">Functional</option>
                      <option value="90">Dance</option>
                    </select>
                    <Tag className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                  {errors.type && (
                    <p className="mt-1 text-sm text-red-600">{errors.type}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giá (VND) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      name="price"
                      type="number"
                      placeholder="0"
                      value={form.price}
                      onChange={handleChange}
                      min="0"
                      step="1000"
                      className={`w-full px-4 py-3 pl-12 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-300 ${
                        errors.price ? "border-red-500" : "border-gray-300"
                      }`}
                      required
                    />
                    <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                  )}
                </div>
              </div>
            </div>
            {/* Schedule Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center space-x-2">
                <Calendar className="text-red-500" />
                <span>Thông tin lịch trình</span>
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày bắt đầu <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      name="startDate"
                      type="date"
                      value={form.startDate}
                      onChange={handleChange}
                      min={new Date().toISOString().split("T")[0]}
                      className={`w-full px-4 py-3 pl-12 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-300 ${
                        errors.startDate ? "border-red-500" : "border-gray-300"
                      }`}
                      required
                    />
                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                  {errors.startDate && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.startDate}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày kết thúc <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      name="endDate"
                      type="date"
                      value={form.endDate}
                      onChange={handleChange}
                      min={
                        form.startDate || new Date().toISOString().split("T")[0]
                      }
                      className={`w-full px-4 py-3 pl-12 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-300 ${
                        errors.endDate ? "border-red-500" : "border-gray-300"
                      }`}
                      required
                    />
                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                  {errors.endDate && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.endDate}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giờ bắt đầu <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      name="startTime"
                      type="time"
                      value={form.startTime}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 pl-12 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-300 ${
                        errors.startTime ? "border-red-500" : "border-gray-300"
                      }`}
                      required
                    />
                    <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                  {errors.startTime && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.startTime}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giờ kết thúc <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      name="endTime"
                      type="time"
                      value={form.endTime}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 pl-12 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-300 ${
                        errors.endTime ? "border-red-500" : "border-gray-300"
                      }`}
                      required
                    />
                    <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                  {errors.endTime && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.endTime}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      name="roomName"
                      placeholder="Nhập Room Name"
                      value={form.roomName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 pl-12 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-300 ${
                        errors.roomName ? "border-red-500" : "border-gray-300"
                      }`}
                      required
                    />
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                  {errors.roomName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.roomName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày tập luyện <span className="text-red-500">*</span>
                  </label>
                  <select
                    multiple
                    name="trainingDays"
                    value={form.trainingDays}
                    onChange={handleMultiChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-300 h-32 ${
                      errors.trainingDays ? "border-red-500" : "border-gray-300"
                    }`}
                    required
                  >
                    {Object.entries(dayTranslations).map(
                      ([englishDay, vietnameseDay]) => (
                        <option
                          key={englishDay}
                          value={englishDay}
                          className="py-2"
                        >
                          {vietnameseDay} ({englishDay})
                        </option>
                      )
                    )}
                  </select>
                  <p className="text-sm text-gray-500 mt-1">
                    Giữ Ctrl/Cmd để chọn nhiều ngày
                  </p>
                  {errors.trainingDays && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.trainingDays}
                    </p>
                  )}

                  {/* Display selected days */}
                  {form.trainingDays.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">Đã chọn:</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {form.trainingDays.map((day) => (
                          <span
                            key={day}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                          >
                            {dayTranslations[day]}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleBack}
                disabled={isSubmitting}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center space-x-2 shadow-lg ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Plus className="text-sm" />
                <span>{isSubmitting ? "Đang tạo..." : "Tạo khóa học"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default CreateCourse;
