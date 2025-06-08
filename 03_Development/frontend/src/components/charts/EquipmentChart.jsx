import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Danh sách màu
const COLORS = ["#FFBB28", "#00C49F", "#FF8042", "#8884d8", "#82ca9d"];

const EquipmentChart = ({ equipments }) => {
  if (!equipments || equipments.length === 0) return null;

  // Nhóm thiết bị theo trạng thái
  const statusCounts = equipments.reduce((acc, eq) => {
    acc[eq.status] = (acc[eq.status] || 0) + 1;
    return acc;
  }, {});

  const data = Object.keys(statusCounts).map((key) => ({
    name: key,
    value: statusCounts[key],
  }));

  return (
    <div className="w-full bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-semibold text-center text-gray-700 mb-4">
        Equipments by Status
      </h3>

      <div className="h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={110}
              label={({ name, value }) => `${name} (${value})`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EquipmentChart;
