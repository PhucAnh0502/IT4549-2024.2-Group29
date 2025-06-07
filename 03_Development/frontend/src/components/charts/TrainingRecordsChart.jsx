import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#FF8042", "#0088FE", "#00C49F", "#FFBB28"];

const categorizeProgress = (progress) => {
  if (progress <= 25) return "Not Started";
  if (progress <= 50) return "In Progress";
  if (progress <= 75) return "Almost Complete";
  return "Completed";
};

const TrainingRecordsChart = ({ trainingRecords }) => {
  if (!trainingRecords || trainingRecords.length === 0)
    return <p>No data available.</p>;

  const categoryCount = {};

  trainingRecords.forEach((record) => {
    const category = categorizeProgress(record.progress);
    categoryCount[category] = (categoryCount[category] || 0) + 1;
  });

  const data = Object.entries(categoryCount).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="w-full bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-center text-xl font-semibold mb-6">
        Training Progress Distribution
      </h3>

      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            label={(entry) => `${entry.name} (${entry.value})`}
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
  );
};

export default TrainingRecordsChart;
