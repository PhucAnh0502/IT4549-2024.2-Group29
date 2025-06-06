import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const API_PATH = import.meta.env.VITE_API_PATH;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }
    try {
      const response = await axios.post(
        `${API_PATH}/Auth/change-password`,
        {
          oldPassword,
          newPassword,
          confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response.data);
      if (response) {
        navigate("/");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.Message) {
        setError(err.response.data.Message);
      } else {
        setError("Unexpected error occurred");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-red-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-red-200">
        <div>
          <h2 className="text-2xl font-bold text-red-500 mb-6 text-center">
            Change Password
          </h2>
          {/* Show Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Enter Old Password */}
            <div className="flex flex-col">
              <label htmlFor="password" className="text-sm font-medium mb-1">
                Enter your old password
              </label>
              <input
                type="password"
                placeholder="********"
                onChange={(e) => setOldPassword(e.target.value)}
                required
                className="px-4 py-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Enter new Password */}
            <div className="flex flex-col">
              <label htmlFor="password" className="text-sm font-medium mb-1">
                Enter your new password
              </label>
              <input
                type="password"
                placeholder="*********"
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="px-4 py-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Confirm password */}
            <div className="flex flex-col">
              <label
                htmlFor="confirm-password"
                className="text-sm font-medium mb-1"
              >
                Confirm password
              </label>
              <input
                type="password"
                placeholder="********"
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="px-4 py-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-200"
            >
              Change Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
