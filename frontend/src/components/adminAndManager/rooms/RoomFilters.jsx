import React from "react";

const RoomFilters = ({
  searchtext,
  selectedStatus,
  selectedRoomType,
  handleSearchChange,
  handleFilterChange,
  handleAddRoom,
}) => {
  const department = localStorage.getItem("department");

  return (
    <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
      <div className="flex items-center gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Search by name"
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          value={searchtext}
          onChange={handleSearchChange}
        />

        <select
          name="status"
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          value={selectedStatus}
          onChange={handleFilterChange}
        >
          <option value="">Select Status</option>
          <option value="Available">Available</option>
          <option value="Full">Full</option>
          <option value="Reserved">Reserved</option>
          <option value="UnderMaintenance">Under Maintenance</option>
        </select>

        <select
          name="roomType"
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          value={selectedRoomType}
          onChange={handleFilterChange}
          required
        >
          <option value="">Select Room Type</option>
          <option value="Cardio">Cardio</option>
          <option value="Strength">Strength</option>
          <option value="CrossFit">CrossFit</option>
          <option value="Yoga">Yoga</option>
          <option value="Pilates">Pilates</option>
          <option value="Boxing">Boxing</option>
          <option value="Spinning">Spinning</option>
          <option value="Functional">Functional</option>
          <option value="Dance">Dance</option>
          <option value="PersonalTraining">Personal Training</option>
          <option value="Recovery">Recovery</option>
          <option value="Multipurpose">Multipurpose</option>
        </select>
      </div>
      {(department === null || department === "Equipment") && (
        <button
          className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-all duration-300"
          onClick={handleAddRoom}
        >
          Add Room
        </button>
      )}
    </div>
  );
};

export default RoomFilters;
