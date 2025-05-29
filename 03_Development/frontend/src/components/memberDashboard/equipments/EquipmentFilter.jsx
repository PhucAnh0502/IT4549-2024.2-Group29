import React from 'react';

const EquipmentFilter = ({ filters, setFilters }) => {
  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const values = {
      searchName: formData.get('searchName'),
      status: formData.get('status'),
      equipmentType: formData.get('equipmentType'),
      minFee: formData.get('minFee'),
      maxFee: formData.get('maxFee'),
    };
    setFilters(values);
  };

  const handleReset = () => {
    setFilters({
      searchName: '',
      status: undefined,
      equipmentType: undefined,
      minFee: undefined,
      maxFee: undefined,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <form onSubmit={handleSearch}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search by Name</label>
            <div className="relative">
              <input
                type="text"
                name="searchName"
                value={filters.searchName}
                onChange={(e) => setFilters({ ...filters, searchName: e.target.value })}
                placeholder="Enter equipment name"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={filters.status || ''}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="AVAILABLE">Available</option>
              <option value="RENTED">Rented</option>
              <option value="MAINTENANCE">Maintenance</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Equipment Type</label>
            <select
              name="equipmentType"
              value={filters.equipmentType || ''}
              onChange={(e) => setFilters({ ...filters, equipmentType: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="CARDIO">Cardio</option>
              <option value="STRENGTH">Strength</option>
              <option value="FLEXIBILITY">Flexibility</option>
              <option value="WEIGHT">Weight</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Fee</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">$</span>
              </div>
              <input
                type="number"
                name="minFee"
                value={filters.minFee || ''}
                onChange={(e) => setFilters({ ...filters, minFee: e.target.value })}
                placeholder="Min fee"
                min="0"
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Fee</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">$</span>
              </div>
              <input
                type="number"
                name="maxFee"
                value={filters.maxFee || ''}
                onChange={(e) => setFilters({ ...filters, maxFee: e.target.value })}
                placeholder="Max fee"
                min="0"
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-4 space-x-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Reset
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
};

export default EquipmentFilter; 