import React, { useEffect, useState } from "react";
import TrainerSummaryCard from "./TrainerSummaryCard";
import {
  FaCalendarCheck,
  FaDumbbell,
  FaFileAlt,
  FaChalkboardTeacher,
} from "react-icons/fa";
import { getAllCourses } from "../../utils/CourseHelper";
import { getAllEquipments } from "../../utils/EquipmentHelper";
import { useNavigate } from "react-router-dom";

const TrainerSummary = () => {
  const [courses, setCourses] = useState(null);
  const [equipments, setEquipments] = useState(null);
  const [loading, setLoading] = useState(true);

  const role = (localStorage.getItem("accountRole") || "").toLowerCase();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [fetchedCourses, fetchedEquipments] =
          await Promise.all([
            getAllCourses(),
            getAllEquipments()
          ]);
        setCourses(fetchedCourses);
        setEquipments(fetchedEquipments);
      } catch (error) {
        console.error("Failed to fetch trainer data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600">
        Đang tải dữ liệu trang tổng quan...
      </div>
    );
  }

  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold mb-6 text-gray-700">
        Trainer Dashboard
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses && (
          <TrainerSummaryCard
            icon={<FaCalendarCheck className="text-white text-2xl" />}
            text="Courses"
            number={courses.length}
            color="bg-green-400"
            handleClick={() => navigate(`/${role}-dashboard/courses`)}
          />
        )}

        {equipments && (
          <TrainerSummaryCard
            icon={<FaDumbbell className="text-white text-2xl" />}
            text="Equipments"
            number={equipments.length}
            color="bg-yellow-400"
            handleClick={() => navigate(`/${role}-dashboard/equipments`)}
          />
        )}
      </div>
    </div>
  );
};

export default TrainerSummary;
