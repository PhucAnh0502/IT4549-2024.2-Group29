import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
  "#FF4560",
  "#00BFFF",
  "#FF69B4",
];

const CourseChart = ({ courses }) => {
  // Tính số lượng khóa học theo type
  const dataMap = courses.reduce((acc, course) => {
    acc[course.type] = (acc[course.type] || 0) + 1;
    return acc;
  }, {});

  // Chuyển thành array [{name: type, value: count}, ...]
  const data = Object.entries(dataMap).map(([type, count]) => ({
    name: type,
    value: count,
  }));

  return (
    <div className="w-full bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-semibold text-center text-gray-700 mb-4">
        Courses by Type
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
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
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

export default CourseChart;
