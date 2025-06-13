import React, { useState, useEffect } from "react";
import { FaSignOutAlt, FaBell, FaUserCircle } from "react-icons/fa";
import { fetchUserInfo } from "../../utils/UserHelper";
import { useNavigate } from "react-router-dom";

const TrainerNavbar = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({});
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const getUserInfo = async () => {
      const userInfo = await fetchUserInfo();
      setUserInfo(userInfo);
    };
    getUserInfo();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("accountRole");
    localStorage.removeItem("department");
    navigate("/");
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <div className="flex items-center text-white justify-between h-16 bg-red-400 px-6 shadow-md">
      <div className="flex items-center space-x-4">
        <p className="text-lg font-semibold">
          Welcome Trainer {userInfo.firstName + " " + userInfo.lastName}
        </p>
        <span className="bg-red-500 px-2 py-1 rounded-full text-xs">
          {userInfo.department || "Training"}
        </span>
      </div>

      <div className="flex items-center space-x-4">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={toggleNotifications}
            className="p-2 hover:bg-red-500 rounded-lg transition-colors duration-300 relative"
          >
            <FaBell className="text-xl" />
            <span className="absolute -top-1 -right-1 bg-yellow-400 text-red-800 text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
              3
            </span>
          </button>
          
          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white text-gray-800 rounded-lg shadow-xl z-50">
              <div className="p-4 border-b">
                <h3 className="font-semibold text-gray-800">Notifications</h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <div className="p-3 border-b hover:bg-gray-50">
                  <p className="text-sm font-medium">New course assignment</p>
                  <p className="text-xs text-gray-600">Advanced Safety Training - Room 201</p>
                </div>
                <div className="p-3 border-b hover:bg-gray-50">
                  <p className="text-sm font-medium">Attendance reminder</p>
                  <p className="text-xs text-gray-600">Please mark attendance for today's sessions</p>
                </div>
                <div className="p-3 hover:bg-gray-50">
                  <p className="text-sm font-medium">Assessment due</p>
                  <p className="text-xs text-gray-600">Equipment Handling Assessment due tomorrow</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Icon */}
        <button className="p-2 hover:bg-red-500 rounded-lg transition-colors duration-300">
          <FaUserCircle className="text-2xl" />
        </button>

        {/* Logout Button */}
        <button
          className="px-6 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors duration-300 flex items-center"
          onClick={handleLogout}
        >
          <FaSignOutAlt className="mr-2" />
          Log out
        </button>
      </div>
    </div>
  );
};

export default TrainerNavbar;