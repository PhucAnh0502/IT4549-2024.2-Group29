import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const UserChart = ({ accounts }) => {
  // Đếm số lượng người dùng theo role
  const roleCount = accounts.reduce((acc, user) => {
    const role = user.account?.role || "Unknown";
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {});

  // Chuyển thành mảng để đưa vào biểu đồ
  const chartData = Object.entries(roleCount).map(([role, count]) => ({
    role,
    count
  }));

  return (
    <div className="bg-white p-6 rounded-xl shadow w-full max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">User Count by Role</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="role" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#4F46E5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserChart;
