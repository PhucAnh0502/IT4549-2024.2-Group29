import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../../assets/logo-icon.png"
import {
  FaCalendarCheck,
  FaCog,
  FaDumbbell,
  FaTachometerAlt,
  FaComments,
  FaFileAlt
} from "react-icons/fa";

const MemberSidebar = () => {
  return (
    <div className="bg-gradient-to-b from-gray-800 to-gray-900 text-white h-screen fixed left-0 top-0 bottom-0 w-64 shadow-xl">
      {/* Header */}
      <div className="bg-red-500 h-16 flex items-center justify-center shadow-md">
        <img src={logo} alt="logo" className="h-12 w-auto scale-200" />
      </div>

      {/* NavLinks */}
      <div className="space-y-3 mt-4">
        <NavLink
          to="/member-dashboard"
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
          to="/member-dashboard/courses"
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
          to="/member-dashboard/training-records"
          className={({ isActive }) =>
            `${
              isActive ? "bg-red-400" : "hover:bg-red-600"
            } flex items-center space-x-4 block py-3 px-6 rounded-lg transition-colors duration-300`
          }
        >
          <FaFileAlt className="text-xl" />
          <span className="text-lg">Training Records</span>
        </NavLink>
        <NavLink
          to="/member-dashboard/equipments"
          className={({ isActive }) =>
            `${
              isActive ? "bg-red-400" : "hover:bg-red-600"
            } flex items-center space-x-4 block py-3 px-6 rounded-lg transition-colors duration-300`
          }
        >
          <FaDumbbell className="text-xl" />
          <span className="text-lg">Equipments</span>
        </NavLink>
        <NavLink
          to="/member-dashboard/reports"
          className={({ isActive }) =>
            `${
              isActive ? "bg-red-400" : "hover:bg-red-600"
            } flex items-center space-x-4 block py-3 px-6 rounded-lg transition-colors duration-300`
          }
        >
          <FaComments className="text-xl" />
          <span className="text-lg">Feedback</span>
        </NavLink>
        <NavLink
          to="/member-dashboard/setting"
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

export default MemberSidebar;
