import React from "react";

const ReportFilters = ({
  searchText,
  selectedStatus,
  selectedReportType,
  handleSearchChange,
  handleFilterChange,
  onAddReport,
}) => {
  return (
    <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
      <div className="flex items-center gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Search by title"
          value={searchText}
          onChange={handleSearchChange}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        />

        <select
          name="status"
          value={selectedStatus}
          onChange={handleFilterChange}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="">Select Status</option>
          <option value="Pending">Pending</option>
          <option value="Resolved">Resolved</option>
          <option value="Rejected">Rejected</option>
        </select>

        <select
          name="reportType"
          value={selectedReportType}
          onChange={handleFilterChange}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="">Select Report Type</option>
          <option value="Equipment">Equipment</option>
          <option value="User">User</option>
          <option value="TrainingRecord">Training Record</option>
          <option value="Course">Course</option>
          <option value="Room">Room</option>
          <option value="Environment">Environment</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <button
        className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-all duration-300"
        onClick={onAddReport}
      >
        Add Report
      </button>
    </div>
  );
};

export default ReportFilters;
