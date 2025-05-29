import React, { useState, useEffect } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { fetchUserInfo } from "../../utils/UserHelper";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({});

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
    navigate("/");
  };
  
  return (
    <div className="flex items-center text-white justify-between h-16 bg-red-400 px-6 shadow-md">
      <p className="text-lg font-semibold">
        Welcome {userInfo.firstName + " " + userInfo.lastName}
      </p>
      <button
        className="px-6 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors duration-300 flex items-center"
        onClick={handleLogout}
      >
        <FaSignOutAlt className="mr-2" />
        Log out
      </button>
    </div>
  );
};

export default Navbar;
