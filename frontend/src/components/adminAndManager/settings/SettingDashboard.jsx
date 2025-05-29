import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserInfo from "./UserInfo";
import EditUserInfo from "./EditUserInfo";
import DepositForm from "./DepositForm";
import { fetchUserInfo } from "../../../utils/UserHelper";

const SettingDashboard = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);  
  const [isDeposit, setIsDeposit] = useState(false);
  const [amount, setAmount] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUserInfo, setEditedUserInfo] = useState({
    firstName: "",
    lastName: "",
    specialization: "",
    department: "",
    dateOfBirth: "",
  });
  const API_PATH = import.meta.env.VITE_API_PATH;

  const getUserInfo = async () => {
      try {
        const data = await fetchUserInfo()
        if(data){
          setUserInfo(data)
          setEditedUserInfo(data)
        }
      } catch (err) {
        alert(err.response?.data?.Message || "Failed to fetch user info.");
      }
    };

  const handleDeposit = async () => {
    try {
      const response = await axios.put(
        `${API_PATH}/User/deposit`,
        { amount },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert(response.data.message);
      getUserInfo();  
    } catch (err) {
      alert(err.response?.data?.message || "Deposit failed.");
    }
  };

  const handleSaveChanges = async () => {
    try {
      const response = await axios.post(
        `${API_PATH}/User/update-profile`,
        editedUserInfo,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert(response.data.message);
      setIsEditing(false);
      getUserInfo();  
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save changes.");
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <>
      {userInfo ? (
        <div className="max-w-3xl mx-auto mt-14 bg-white p-10 rounded-3xl shadow-xl border border-gray-200 space-y-8">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-2"
          >
            <span className="text-lg">←</span> Back
          </button>

          <h2 className="text-3xl font-bold text-center text-gray-800">
            Personal Information
          </h2>

          {!isEditing && (
            <UserInfo
              userInfo={userInfo}
            />
          )}

          {isEditing && (
            <EditUserInfo
              editedUserInfo={editedUserInfo}
              setEditedUserInfo={setEditedUserInfo}
              handleSaveChanges={handleSaveChanges}
              setIsEditing={setIsEditing}
            />
          )}

          <div className="flex justify-center gap-6 pt-6 border-t border-gray-200">
            {!isEditing && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition text-sm font-medium"
                >
                  Edit Info
                </button>
                <button
                  onClick={() => navigate("/change-password")}
                  className="bg-yellow-500 text-white px-5 py-2 rounded-lg hover:bg-yellow-600 transition text-sm font-medium"
                >
                  Change Password
                </button>
                <button
                  onClick={() => setIsDeposit(true)}
                  className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600 transition text-sm font-medium"
                >
                  Deposit
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-teal-500 rounded-full animate-spin border-t-transparent mb-4"></div>
            <p className="text-lg font-semibold text-teal-500 animate-pulse">
              Loading...
            </p>
          </div>
        </div>
      )}

      <DepositForm
        isDeposit={isDeposit}
        setIsDeposit={setIsDeposit}
        amount={amount}
        setAmount={setAmount}
        handleDeposit={handleDeposit}
      />
    </>
  );
};

export default SettingDashboard;
