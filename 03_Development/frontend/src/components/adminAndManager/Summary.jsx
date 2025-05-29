import React, { useEffect, useState } from "react";
import SummaryCard from "./SummaryCard";
import {
  FaCalendarCheck,
  FaDumbbell,
  FaUsers,
  FaBuilding,
  FaFileAlt,
  FaChalkboardTeacher,
} from "react-icons/fa";
import { getAllUsers } from "../../utils/UserHelper";
import { getAllRooms } from "../../utils/RoomHelper";
import { getAllEquipments } from "../../utils/EquipmentHelper";
import { getAllCourses } from "../../utils/CourseHelper";
import { getAllReports } from "../../utils/ReportHelper";
import { getAllTrainingRecords } from "../../utils/TrainingRecordHelper";
import { useNavigate } from "react-router-dom";

const AdminSummary = () => {
  const [accounts, setAccounts] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [reports, setReports] = useState([]);
  const [records, setRecords] = useState([]);

  const department = localStorage.getItem("department");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [accounts, rooms, equipments, courses, reports, records] =
          await Promise.all([
            getAllUsers(),
            getAllRooms(),
            getAllEquipments(),
            getAllCourses(),
            getAllReports(),
            getAllTrainingRecords(),
          ]);

        setAccounts(accounts);
        setRooms(rooms);
        setEquipments(equipments);
        setCourses(courses);
        setReports(reports);
        setRecords(records);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold mb-6 text-gray-700">
        Dashboard Overview
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(department === null || department === "HR") && (
          <SummaryCard
            icon={<FaUsers className="text-white text-2xl" />}
            text="Users"
            number={accounts.length}
            color="bg-red-400"
            handleClick={() => navigate("/admin-dashboard/users")}
          />
        )}
        <SummaryCard
          icon={<FaBuilding className="text-white text-2xl" />}
          text="Rooms"
          number={rooms.length}
          color="bg-blue-400"
          handleClick={() => navigate("/admin-dashboard/rooms")}
        />
        <SummaryCard
          icon={<FaCalendarCheck className="text-white text-2xl" />}
          text="Courses"
          number={courses.length}
          color="bg-green-400"
          handleClick={() => navigate("/admin-dashboard/courses")}
        />
        <SummaryCard
          icon={<FaDumbbell className="text-white text-2xl" />}
          text="Equipments"
          number={equipments.length}
          color="bg-yellow-400"
          handleClick={() => navigate("/admin-dashboard/equipments")}
        />
        <SummaryCard
          icon={<FaFileAlt className="text-white text-2xl" />}
          text="Reports"
          number={reports.length}
          color="bg-purple-400"
          handleClick={() => {
            navigate("/admin-dashboard/reports");
          }}
        />
        <SummaryCard
          icon={<FaChalkboardTeacher className="text-white text-2xl" />}
          text="Training Records"
          number={records.length}
          color="bg-pink-400"
          handleClick={() => {
            navigate("/admin-dashboard/training-records");
          }}
        />
      </div>
    </div>
  );
};

export default AdminSummary;
