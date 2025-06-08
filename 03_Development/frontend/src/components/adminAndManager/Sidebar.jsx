import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../../assets/logo-icon.png";
import {
  FaBuilding,
  FaCalendarCheck,
  FaCog,
  FaDumbbell,
  FaFileAlt,
  FaTachometerAlt,
  FaUsers,
  FaChalkboardTeacher,
} from "react-icons/fa";

const ManagerSidebar = () => {
  const department = localStorage.getItem("department");
  const role = localStorage.getItem("accountRole").toLowerCase()

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
        {(department === "HR" || role === "admin") &&(
          <NavLink
            to={`/${role}-dashboard/users`}
            className={({ isActive }) =>
              `${
                isActive ? "bg-red-400" : "hover:bg-red-600"
              } flex items-center space-x-4 block py-3 px-6 rounded-lg transition-colors duration-300`
            }
          >
            <FaUsers className="text-xl" />
            <span className="text-lg">Users</span>
          </NavLink>
        )}
        <NavLink
          to={`/${role}-dashboard/rooms`}
          className={({ isActive }) =>
            `${
              isActive ? "bg-red-400" : "hover:bg-red-600"
            } flex items-center space-x-4 block py-3 px-6 rounded-lg transition-colors duration-300`
          }
        >
          <FaBuilding className="text-xl" />
          <span className="text-lg">Rooms</span>
        </NavLink>
        <NavLink
          to={`/${role}-dashboard/courses`}
          className={({ isActive }) =>
            `${
              isActive ? "bg-red-400" : "hover:bg-red-600"
            } flex items-center space-x-4 block py-3 px-6 rounded-lg transition-colors duration-300`
          }
        >
          <FaCalendarCheck className="text-xl" />
          <span className="text-lg">Courses</span>
        </NavLink>
        <NavLink
          to={`/${role}-dashboard/equipments`}
          className={({ isActive }) =>
            `${
              isActive ? "bg-red-400" : "hover:bg-red-600"
            } flex items-center space-x-4 block py-3 px-6 rounded-lg transition-colors duration-300`
          }
        >
          <FaDumbbell className="text-xl" />
          <span className="text-lg">Equipments</span>
        </NavLink>
        {(department === "Support" || role === "admin") && (
          <NavLink
            to={`/${role}-dashboard/reports`}
            className={({ isActive }) =>
              `${
                isActive ? "bg-red-400" : "hover:bg-red-600"
              } flex items-center space-x-4 block py-3 px-6 rounded-lg transition-colors duration-300`
            }
          >
            <FaFileAlt className="text-xl" />
            <span className="text-lg">Reports</span>
          </NavLink>
        )}
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
          to={`/${role}-dashboard/setting`}
          className={({ isActive }) =>
            `${
              isActive ? "bg-red-400" : "hover:bg-red-600"
            } flex items-center space-x-4 block py-3 px-6 rounded-lg transition-colors duration-300`
          }
        >
          <FaCog className="text-xl" />
          <span className="text-lg">Settings</span>
        </NavLink>
      </div>
    </div>
  );
};

export default ManagerSidebar;
