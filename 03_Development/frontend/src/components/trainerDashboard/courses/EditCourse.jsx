import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCoursesByTrainerId, updateCourse } from "../../../utils/CourseHelper";

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      const course = await getCoursesByTrainerId(id);
      if (course) {
        setForm({
          ...course,
          trainingDays: course.trainingDays || [],
          startDate: course.startDate?.split("T")[0],
          endDate: course.endDate?.split("T")[0],
        });
      }
    };
    fetchCourse();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleMultiChange = (e) => {
    const selected = [...e.target.selectedOptions].map((opt) => opt.value);
    setForm({ ...form, trainingDays: selected });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateCourse(id, {
        ...form,
        price: parseFloat(form.price),
        trainingDays: form.trainingDays,
      });
      alert("Cập nhật khóa học thành công!");
      navigate("/trainer-dashboard/my-courses");
    } catch (err) {
      console.log(err)
      alert("Cập nhật thất bại!");
    }
  };

  if (!form) return <p className="text-center text-gray-500">Đang tải dữ liệu...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Chỉnh sửa khóa học</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label className="block mb-1 font-semibold">Tên khóa học</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Type */}
        <div>
          <label className="block mb-1 font-semibold">Loại khóa học</label>
          <input
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block mb-1 font-semibold">Giá</label>
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Room ID */}
        <div>
          <label className="block mb-1 font-semibold">ID Phòng</label>
          <input
            name="roomId"
            value={form.roomId}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Start Date */}
        <div>
          <label className="block mb-1 font-semibold">Ngày bắt đầu</label>
          <input
            name="startDate"
            type="date"
            value={form.startDate}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block mb-1 font-semibold">Ngày kết thúc</label>
          <input
            name="endDate"
            type="date"
            value={form.endDate}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Start Time */}
        <div>
          <label className="block mb-1 font-semibold">Giờ bắt đầu</label>
          <input
            name="startTime"
            type="time"
            value={form.startTime}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* End Time */}
        <div>
          <label className="block mb-1 font-semibold">Giờ kết thúc</label>
          <input
            name="endTime"
            type="time"
            value={form.endTime}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Training Days */}
        <div className="md:col-span-2">
          <label className="block mb-1 font-semibold">Ngày học</label>
          <select
            name="trainingDays"
            multiple
            value={form.trainingDays}
            onChange={handleMultiChange}
            className="w-full border p-2 rounded h-32"
          >
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(
              (day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              )
            )}
          </select>
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block mb-1 font-semibold">Mô tả</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            rows={4}
          />
        </div>

        {/* Submit */}
        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-semibold"
          >
            Lưu thay đổi
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCourse;
