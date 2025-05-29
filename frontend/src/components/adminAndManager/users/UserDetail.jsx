import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const UserDetail = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [user, setUser] = useState({});

  const API_PATH = import.meta.env.VITE_API_PATH;

  console.log(userId);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${API_PATH}/User/user-for-hr/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log(response.data);
        if (response.data) {
          setUser(response.data);
        }
      } catch (err) {
        alert(err.response.data.Message);
      }
    };

    fetchUser();
  }, []);
  return (
    <>
      {user ? (
        <div className="max-w-5xl mx-auto mt-14 bg-white p-10 rounded-3xl shadow-xl border border-gray-200">
          <button
            onClick={() => navigate(-1)}
            className="mb-8 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-2"
          >
            <span className="text-lg">←</span> Back
          </button>

          <h2 className="text-4xl font-semibold mb-10 text-center text-gray-800">
            User Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-8">
              <div className="flex items-center space-x-6">
                <p className="text-lg font-semibold text-gray-700 w-1/3">
                  Full Name:
                </p>
                <p className="text-lg text-gray-900">
                  {user.firstName} {user.lastName}
                </p>
              </div>
              <div className="flex items-center space-x-6">
                <p className="text-lg font-semibold text-gray-700 w-1/3">
                  Date of Birth:
                </p>
                <p className="text-lg text-gray-900">
                  {new Date(user.dateOfBirth).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center space-x-6">
                <p className="text-lg font-semibold text-gray-700 w-1/3">
                  Current Balance:
                </p>
                <p className="text-lg text-gray-900">
                  {user.currentBalance != null
                    ? `${user.currentBalance.toLocaleString("vi-VN")} VND`
                    : "N/A"}
                </p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex items-center space-x-6">
                <p className="text-lg font-semibold text-gray-700 w-1/3">
                  Email:
                </p>
                <p className="text-lg text-gray-900">
                  {user.account?.email || "N/A"}
                </p>
              </div>
              <div className="flex items-center space-x-6">
                <p className="text-lg font-semibold text-gray-700 w-1/3">
                  Role:
                </p>
                <p className="text-lg text-gray-900">
                  {user.account?.role || "N/A"}
                </p>
              </div>

              {user.account?.role === "Trainer" && (
                <div className="flex items-center space-x-6">
                  <p className="text-lg font-semibold text-gray-700 w-1/3">
                    Specialization:
                  </p>
                  <p className="text-lg text-gray-900">
                    {user.specialization || "Not updated"}
                  </p>
                </div>
              )}

              {user.account?.role === "Manager" && (
                <div className="flex items-center space-x-6">
                  <p className="text-lg font-semibold text-gray-700 w-1/3">
                    Department:
                  </p>
                  <p className="text-lg text-gray-900">
                    {user.department || "Not updated"}
                  </p>
                </div>
              )}
            </div>
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
    </>
  );
};

export default UserDetail;
