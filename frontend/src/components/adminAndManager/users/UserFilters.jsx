import React from "react";

const UserFilters = ({ filterByInput, filterByButton }) => (
  <div className="flex justify-between items-center">
    <input
      type="text"
      placeholder="Search by name"
      className="px-4 py-0.5 border"
      onChange={filterByInput}
    />

    <div className="space-x-4">
      <button
        className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all"
        onClick={() => filterByButton("Manager")}
      >
        Manager
      </button>
      <button
        className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all"
        onClick={() => filterByButton("Trainer")}
      >
        Trainer
      </button>
      <button
        className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all"
        onClick={() => filterByButton("Member")}
      >
        Member
      </button>
    </div>
  </div>
);

export default UserFilters;
