import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Hàm xử lý dữ liệu: tạo cấu trúc dạng [{ name: "User", Pending: 2, Resolved: 1, ... }, ...]
const processData = (reports) => {
  const typeStatusMap = {};

  reports.forEach((report) => {
    const type = report.reportType;
    const status = report.status;

    if (!typeStatusMap[type]) {
      typeStatusMap[type] = {};
    }

    typeStatusMap[type][status] = (typeStatusMap[type][status] || 0) + 1;
  });

  return Object.entries(typeStatusMap).map(([type, statuses]) => ({
    name: type,
    ...statuses,
  }));
};

// Lấy tất cả các trạng thái xuất hiện (dùng để tạo <Bar /> tương ứng)
const extractAllStatuses = (reports) => {
  const statuses = new Set();
  reports.forEach((report) => statuses.add(report.status));
  return Array.from(statuses);
};

const COLORS = [
  "#8884d8", // tím
  "#82ca9d", // xanh lá
  "#ffc658", // vàng
  "#ff7f50", // cam
  "#a4de6c", // xanh lá nhạt
  "#d0ed57", // vàng nhạt
];

const ReportChart = ({ reports }) => {
  const data = processData(reports);
  const allStatuses = extractAllStatuses(reports);

  return (
    <div className="w-full bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-center text-xl font-semibold mb-6 text-gray-700">
        Report Status by Type
      </h3>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />

          {allStatuses.map((status, index) => (
            <Bar
              key={status}
              dataKey={status}
              stackId="a"
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReportChart;
