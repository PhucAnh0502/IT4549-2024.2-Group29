import React from "react";

const CourseFilters = ({
  searchtext,
  selectedStatus,
  selectedCourseType,
  filterStartDate,
  filterEndDate,
  onSearchChange,
  onStatusChange,
  onTypeChange,
  onStartDateChange,
  onEndDateChange,
}) => {
  return (
    <div className="flex items-center gap-4 flex-wrap">
      <input
        type="text"
        placeholder="Search by name"
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        value={searchtext}
        onChange={onSearchChange}
      />

      <select
        name="status"
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        value={selectedStatus}
        onChange={onStatusChange}
      >
        <option value="">Select Status</option>
        <option value="Upcoming">Upcoming</option>
        <option value="Ongoing">On Going</option>
        <option value="Completed">Completed</option>
        <option value="Cancelled">Cancelled</option>
      </select>

      <select
        name="type"
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        value={selectedCourseType}
        onChange={onTypeChange}
      >
        <option value="">Select Course Type</option>
        <option value="Cardio">Cardio</option>
        <option value="Strength">Strength</option>
        <option value="CrossFit">CrossFit</option>
        <option value="Yoga">Yoga</option>
        <option value="Pilates">Pilates</option>
        <option value="Boxing">Boxing</option>
        <option value="Spinning">Spinning</option>
        <option value="Functional">Functional</option>
        <option value="Dance">Dance</option>
      </select>

      <input
        type="date"
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        value={filterStartDate}
        onChange={onStartDateChange}
      />

      <input
        type="date"
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        value={filterEndDate}
        onChange={onEndDateChange}
      />
    </div>
  );
};

export default CourseFilters;
