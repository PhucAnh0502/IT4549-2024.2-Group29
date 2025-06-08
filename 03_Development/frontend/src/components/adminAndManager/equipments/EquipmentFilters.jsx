import React from "react";

const EquipmentFilters = ({ filters, setFilters, equipmentType, navigate }) => {
  const department = localStorage.getItem("department");
  const role = localStorage.getItem('accountRole').toLowerCase()

  const splitCamelCase = (str) => {
    return str
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
      <div className="flex gap-4 overflow-x-auto whitespace-nowrap w-full pb-2 pt-6">
        <input
          type="text"
          name="searchtext"
          placeholder="Search by name"
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 flex-shrink-0 min-w-[180px]"
          value={filters.searchtext}
          onChange={handleInputChange}
        />

        <select
          name="selectedStatus"
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 flex-shrink-0 min-w-[180px]"
          value={filters.selectedStatus}
          onChange={handleInputChange}
        >
          <option value="">Select Status</option>
          <option value="Available">Available</option>
          <option value="InUse">In Use</option>
          <option value="NeedMaintainence">Need Maintainence</option>
          <option value="UnderMaintenance">Under Maintenance</option>
          <option value="OutOfService">Out Of Service</option>
          <option value="Using">Using</option>
        </select>

        <select
          name="selectedEquipmentType"
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 flex-shrink-0 min-w-[200px]"
          value={filters.selectedEquipmentType}
          onChange={handleInputChange}
        >
          <option value="">Select Equipment Type</option>
          {equipmentType.map((type) => (
            <option key={type} value={type}>
              {splitCamelCase(type)}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="minPrice"
          placeholder="Min Fee"
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 flex-shrink-0 min-w-[120px]"
          value={filters.minPrice || ""}
          onChange={handleInputChange}
        />

        <input
          type="number"
          name="maxPrice"
          placeholder="Max Fee"
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 flex-shrink-0 min-w-[120px]"
          value={filters.maxPrice || ""}
          onChange={handleInputChange}
        />
      </div>
      {(role === "admin" || department === "Equipment") && (
        <button
          className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-all duration-300"
          onClick={() => navigate(`/${role}-dashboard/equipments/add-equipment`)}
        >
          Add Equipment
        </button>
      )}
    </div>
  );
};

export default EquipmentFilters;
