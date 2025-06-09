import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../../assets/logo-icon.png";
import {
  FaBookOpen,
  FaChalkboardTeacher,
  FaClipboardList,
  FaTachometerAlt
  //FaBookOpen,
  //FaUserGraduate,
} from "react-icons/fa";

const TrainerSidebar = () => {
  const role = localStorage.getItem("accountRole")?.toLowerCase();

  return (
    <div className="bg-gradient-to-b from-gray-800 to-gray-900 text-white h-screen fixed left-0 top-0 bottom-0 w-64 shadow-xl">
      {/* Header */}
      <div className="bg-red-500 h-16 flex items-center justify-center shadow-md">
        <img src={logo} alt="logo" className="h-12 w-auto scale-200" />
      </div>

      {/* NavLinks */}
      <div className="space-y-3 mt-4">
        <NavLink
          to={`/${role}-dashboard`}
          className={({ isActive }) =>
            `${
              isActive ? "bg-red-400" : "hover:bg-red-600"
            } flex items-center space-x-4 block py-3 px-6 rounded-lg transition-colors duration-300`
          }
          end
        >
          <FaTachometerAlt className="text-xl" />
          <span className="text-lg">Dashboard</span>
        </NavLink>

        <NavLink
          to={`/${role}-dashboard/my-courses`}
          className={({ isActive }) =>
            `${
              isActive ? "bg-red-400" : "hover:bg-red-600"
            } flex items-center space-x-4 block py-3 px-6 rounded-lg transition-colors duration-300`
          }
        >
          <FaBookOpen className="text-xl" />
          <span className="text-lg">My Courses</span>
        </NavLink>

        {/* <NavLink
          to={`/${role}-dashboard/schedule`}
          className={({ isActive }) =>
            `${
              isActive ? "bg-red-400" : "hover:bg-red-600"
            } flex items-center space-x-4 block py-3 px-6 rounded-lg transition-colors duration-300`
          }
        >
          <FaCalendarCheck className="text-xl" />
          <span className="text-lg">Schedule</span>
        </NavLink>

        <NavLink
          to={`/${role}-dashboard/trainees`}
          className={({ isActive }) =>
            `${
              isActive ? "bg-red-400" : "hover:bg-red-600"
            } flex items-center space-x-4 block py-3 px-6 rounded-lg transition-colors duration-300`
          }
        >
          <FaUserGraduate className="text-xl" />
          <span className="text-lg">Trainees</span>
        </NavLink>

        <NavLink
          to={`/${role}-dashboard/attendance`}
          className={({ isActive }) =>
            `${
              isActive ? "bg-red-400" : "hover:bg-red-600"
            } flex items-center space-x-4 block py-3 px-6 rounded-lg transition-colors duration-300`
          }
        >
          <FaClipboardList className="text-xl" />
          <span className="text-lg">Attendance</span>
        </NavLink> */}

        <NavLink
          to={`/${role}-dashboard/training-records`}
          className={({ isActive }) =>
            `${
              isActive ? "bg-red-400" : "hover:bg-red-600"
            } flex items-center space-x-4 block py-3 px-6 rounded-lg transition-colors duration-300`
          }
        >
          <FaChalkboardTeacher className="text-xl" />
          <span className="text-lg">Training Records</span>
        </NavLink>

        <NavLink
          to={`/${role}-dashboard/reports`}
          className={({ isActive }) =>
            `${
              isActive ? "bg-red-400" : "hover:bg-red-600"
            } flex items-center space-x-4 block py-3 px-6 rounded-lg transition-colors duration-300`
          }
        >
          <FaClipboardList className="text-xl" />
          <span className="text-lg">Reports</span>
        </NavLink>
      </div>
    </div>
  );
};

export default TrainerSidebar;
