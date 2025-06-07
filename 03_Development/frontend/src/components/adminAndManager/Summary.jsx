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
import UserChart from "../charts/UserChart";
import RoomChart from "../charts/RoomChart";
import CourseChart from "../charts/CourseChart";
import EquipmentChart from "../charts/EquipmentChart";
import ReportChart from "../charts/ReportChart";
import TrainingRecordsChart from "../charts/TrainingRecordsChart";

const AdminSummary = () => {
  const [accounts, setAccounts] = useState(null);
  const [rooms, setRooms] = useState(null);
  const [equipments, setEquipments] = useState(null);
  const [courses, setCourses] = useState(null);
  const [reports, setReports] = useState(null);
  const [records, setRecords] = useState(null);
  const [loading, setLoading] = useState(true);

  const department = localStorage.getItem("department");
  const role = (localStorage.getItem("accountRole") || "").toLowerCase();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const promises = [];

        if (role === "admin" || department === "HR") {
          promises.push(getAllUsers());
        } else {
          promises.push(Promise.resolve(null));
        }
        promises.push(getAllRooms());
        promises.push(getAllEquipments());
        promises.push(getAllCourses());
        promises.push(getAllReports());
        promises.push(getAllTrainingRecords());

        const [
          fetchedAccounts,
          fetchedRooms,
          fetchedEquipments,
          fetchedCourses,
          fetchedReports,
          fetchedRecords,
        ] = await Promise.all(promises);

        setAccounts(fetchedAccounts);
        setRooms(fetchedRooms);
        setEquipments(fetchedEquipments);
        setCourses(fetchedCourses);
        setReports(fetchedReports);
        setRecords(fetchedRecords);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [role, department]);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600">
        Loading dashboard data...
      </div>
    );
  }

  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold mb-6 text-gray-700">
        Dashboard Overview
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(role === "admin" || department === "HR") && accounts && (
          <SummaryCard
            icon={<FaUsers className="text-white text-2xl" />}
            text="Users"
            number={accounts.length}
            color="bg-red-400"
            handleClick={() => navigate(`/${role}-dashboard/users`)}
          />
        )}

        {rooms && (
          <SummaryCard
            icon={<FaBuilding className="text-white text-2xl" />}
            text="Rooms"
            number={rooms.length}
            color="bg-blue-400"
            handleClick={() => navigate(`/${role}-dashboard/rooms`)}
          />
        )}

        {courses && (
          <SummaryCard
            icon={<FaCalendarCheck className="text-white text-2xl" />}
            text="Courses"
            number={courses.length}
            color="bg-green-400"
            handleClick={() => navigate(`/${role}-dashboard/courses`)}
          />
        )}

        {equipments && (
          <SummaryCard
            icon={<FaDumbbell className="text-white text-2xl" />}
            text="Equipments"
            number={equipments.length}
            color="bg-yellow-400"
            handleClick={() => navigate(`/${role}-dashboard/equipments`)}
          />
        )}

        {reports && (
          <SummaryCard
            icon={<FaFileAlt className="text-white text-2xl" />}
            text="Reports"
            number={reports.length}
            color="bg-purple-400"
            handleClick={() => navigate(`/${role}-dashboard/reports`)}
          />
        )}

        {records && (
          <SummaryCard
            icon={<FaChalkboardTeacher className="text-white text-2xl" />}
            text="Training Records"
            number={records.length}
            color="bg-pink-400"
            handleClick={() => navigate(`/${role}-dashboard/training-records`)}
          />
        )}
      </div>

      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
          {(role === "admin" || department === "HR") && (
            <UserChart accounts={accounts} />
          )}
          <RoomChart rooms={rooms} />
          <CourseChart courses={courses} />
          <EquipmentChart equipments={equipments} />
          {(role === "admin" || department === "Support") && (
            <>
              <ReportChart reports={reports} />
              <TrainingRecordsChart trainingRecords={records} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSummary;
