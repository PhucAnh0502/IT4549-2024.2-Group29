import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

// Màu sắc cho các trạng thái
const COLORS = ["#0088FE", "#FF8042", "#00C49F", "#FFBB28", "#AA66CC"];

const RoomChart = ({ rooms }) => {
  // Đếm số lượng phòng theo status
  const statusCount = rooms.reduce((acc, room) => {
    const status = room.status || "Unknown";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  // Định dạng lại dữ liệu cho biểu đồ
  const pieData = Object.entries(statusCount).map(([status, count]) => ({
    name: status,
    value: count,
  }));

  return (
    <div className="w-full bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">
        Room Status Pie Chart
      </h2>

      <div className="flex justify-center">
        <PieChart width={400} height={300}>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            label
            outerRadius={100}
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
    </div>
  );
};

export default RoomChart;
