import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCourseById, updateCourse } from "../../../utils/CourseHelper";

const EditCourse = () => {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      const course = await getCourseById(id);
      if (course) {
        setForm({
          ...course,
          trainingDays: course.trainingDays || [],
        });
      }
    };
    fetchCourse();
  }, [id]);

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
      await updateCourse(id, form);
      alert("Course updated successfully");
      navigate("/trainer/courses");
    } catch (err) {
      alert("Failed to update course");
    }
  };

  if (!form) return <p>Loading...</p>;

  return (
    <div className="p-5 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Edit Course</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" value={form.name} onChange={handleChange} className="border p-2 w-full" />
        <textarea name="description" value={form.description} onChange={handleChange} className="border p-2 w-full" />
        <input name="type" value={form.type} onChange={handleChange} className="border p-2 w-full" />
        <input name="price" type="number" value={form.price} onChange={handleChange} className="border p-2 w-full" />
        <input name="startDate" type="date" value={form.startDate?.split("T")[0]} onChange={handleChange} className="border p-2 w-full" />
        <input name="endDate" type="date" value={form.endDate?.split("T")[0]} onChange={handleChange} className="border p-2 w-full" />
        <input name="startTime" type="time" value={form.startTime} onChange={handleChange} className="border p-2 w-full" />
        <input name="endTime" type="time" value={form.endTime} onChange={handleChange} className="border p-2 w-full" />
        <input name="roomId" value={form.roomId} onChange={handleChange} className="border p-2 w-full" />
        <select multiple name="trainingDays" value={form.trainingDays} onChange={handleMultiChange} className="border p-2 w-full">
          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
            <option key={day} value={day}>{day}</option>
          ))}
        </select>
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Update Course</button>
      </form>
    </div>
  );
};

export default EditCourse;
