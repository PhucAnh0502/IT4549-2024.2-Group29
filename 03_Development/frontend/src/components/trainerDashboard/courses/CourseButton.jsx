import React from "react";
import { useNavigate } from "react-router-dom";
import { deleteCourse } from "../../../utils/CourseHelper";

const CourseButtons = ({ id, onCourseDelete }) => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      await deleteCourse(id);
      onCourseDelete();
    }
  };

  return (
    <div className="space-x-2">
      <button
        onClick={() => navigate(`/trainer/courses/edit/${id}`)}
        className="bg-yellow-500 text-white px-2 py-1 rounded"
      >
        Edit
      </button>
      <button
        onClick={handleDelete}
        className="bg-red-600 text-white px-2 py-1 rounded"
      >
        Delete
      </button>
    </div>
  );
};

export default CourseButtons;
