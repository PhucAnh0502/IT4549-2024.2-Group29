import React, { useEffect, useState } from "react";
import { getAllEquipments, getRoomById } from "../../../utils/EquipmentHelper";
import { useNavigate, Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { FaArrowRight } from "react-icons/fa";

const MemberEquipmentList = () => {
  const navigate = useNavigate();
  const [equipments, setEquipments] = useState([]);
  const [filteredEquipments, setFilteredEquipments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    searchName: "",
    status: "",
    equipmentType: "",
    minFee: "",
    maxFee: "",
  });

  const splitCamelCase = (str) => {
    return str
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2");
  };

  const fetchEquipments = async () => {
    setLoading(true);
    try {
      const response = await getAllEquipments();
      const equipmentsData = Array.isArray(response)
        ? response
        : response?.$values || [];

      if (equipmentsData.length > 0) {
        const data = await Promise.all(
          equipmentsData.map(async (equipment, index) => {
            const room = await getRoomById(equipment.roomId);
            return {
              id: equipment.id,
              sno: ++index,
              code: equipment.deviceCode,
              name: splitCamelCase(equipment.name),
              type: splitCamelCase(equipment.deviceType),
              manufacturer: equipment.manufacturer,
              warrantyPeriod: equipment.warrantyPeriod,
              rentalFee: equipment.rentalFee,
              status: equipment.status,
              room: room?.name || "N/A",
            };
          })
        );
        setEquipments(data);
        setFilteredEquipments(data);
      } else {
        console.error("No equipment data found:", equipmentsData);
      }
    } catch (error) {
      console.error("Error fetching equipments:", error);
      setEquipments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipments();
  }, []);

  useEffect(() => {
    const { searchName, status, equipmentType, minFee, maxFee } = filters;
    const data = equipments.filter((equipment) => {
      const matchesName =
        !searchName ||
        equipment.name.toLowerCase().includes(searchName.toLowerCase());
      const matchesStatus = !status || equipment.status === status;
      const matchesType = !equipmentType || equipment.type === equipmentType;
      const matchesMinFee = !minFee || equipment.rentalFee >= Number(minFee);
      const matchesMaxFee = !maxFee || equipment.rentalFee <= Number(maxFee);
      return (
        matchesName &&
        matchesStatus &&
        matchesType &&
        matchesMinFee &&
        matchesMaxFee
      );
    });
    setFilteredEquipments(data);
  }, [filters, equipments]);

  const handleViewDetails = (equipment) => {
    navigate(`/member-dashboard/equipments/${equipment.id}`);
  };

  const columns = [
    { name: "No", selector: (row) => row.sno, sortable: true, width: "70px" },
    { name: "Code", selector: (row) => row.code, sortable: true, wrap: true, width: "110px" },
    { name: "Name", selector: (row) => row.name, sortable: true, wrap: true, width: "130px" },
    { name: "Type", selector: (row) => row.type, sortable: true, wrap: true, width: "110px" },
    { name: "Manufacturer", selector: (row) => row.manufacturer, sortable: true, wrap: true, width: "160px" },
    { name: "Warranty", selector: (row) => row.warrantyPeriod, sortable: true, width: "100px" },
    { name: "Rental Fee", selector: (row) => row.rentalFee, sortable: true, width: "160px" },
    { name: "Status", selector: (row) => row.status, sortable: true, width: "90px" },
    { name: "Room", selector: (row) => row.room, sortable: true, wrap: true, width: "110px" },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleViewDetails(row)}
            className="px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            View
          </button>
        </div>
      ),
      width: "140px"
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-500 rounded-full animate-spin border-t-transparent mb-4"></div>
          <p className="text-lg font-semibold text-red-500 animate-pulse">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-2xl font-bold mb-6 text-gray-700">Equipment List</h3>
        <Link
          to="/member-dashboard/equipments/bookings"
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-2"
        >
          View My Bookings
          <FaArrowRight className="text-sm" />
        </Link>
      </div>

      <div className="bg-white rounded shadow p-4 mb-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <input
            type="text"
            value={filters.searchName}
            onChange={(e) =>
              setFilters({ ...filters, searchName: e.target.value })
            }
            placeholder="Search by name"
            className="px-2 py-1 text-xs border border-gray-300 rounded"
          />
          <select
            value={filters.status}
            onChange={(e) =>
              setFilters({ ...filters, status: e.target.value })
            }
            className="px-2 py-1 text-xs border border-gray-300 rounded"
          >
            <option value="">All Status</option>
            <option value="Available">Available</option>
            <option value="Rented">Rented</option>
            <option value="Maintenance">Maintenance</option>
          </select>
          <select
            value={filters.equipmentType}
            onChange={(e) =>
              setFilters({ ...filters, equipmentType: e.target.value })
            }
            className="px-2 py-1 text-xs border border-gray-300 rounded"
          >
            <option value="">All Types</option>
            {Array.from(new Set(equipments.map((e) => e.type))).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={filters.minFee}
            onChange={(e) =>
              setFilters({ ...filters, minFee: e.target.value })
            }
            placeholder="Min fee"
            className="px-2 py-1 text-xs border border-gray-300 rounded"
            min="0"
          />
          <input
            type="number"
            value={filters.maxFee}
            onChange={(e) =>
              setFilters({ ...filters, maxFee: e.target.value })
            }
            placeholder="Max fee"
            className="px-2 py-1 text-xs border border-gray-300 rounded"
            min="0"
          />
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow overflow-x-auto">
        <DataTable
          columns={columns}
          data={filteredEquipments}
          pagination
          responsive
          highlightOnHover
          striped
        />
      </div>
    </div>
  );
};

export default MemberEquipmentList;
