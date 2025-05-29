import React, { useEffect, useState } from "react";
import { getAllEquipments, getRoomById } from "../../../utils/EquipmentHelper";
import { useNavigate } from "react-router-dom";
import EquipmentFilters from "./EquipmentFilters";
import DataTable from "react-data-table-component";
import axios from "axios";
import EquipmentButtons from "./EquipmentButtons";
import { columns } from "./EquipmentColumns";

const EquipmentsList = () => {
  const navigate = useNavigate();
  const [equipments, setEquipments] = useState([]);
  const [filteredEquipments, setFilteredEquipments] = useState([]);
  const [equipmentType, setEquipmentType] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    searchtext: "",
    selectedStatus: "",
    selectedEquipmentType: "",
    minPrice: null,
    maxPrice: null,
  });

  const API_PATH = import.meta.env.VITE_API_PATH;

  const splitCamelCase = (str) => {
    return str
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2");
  };

  const fetchEquipments = async () => {
    setLoading(true);
    try {
      const equipments = await getAllEquipments();
      if (equipments) {
        const data = await Promise.all(
          equipments.map(async (equipment, index) => {
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
              action: (
                <EquipmentButtons
                  id={equipment.id}
                  onEquipmentDelete={fetchEquipments}
                />
              ),
            };
          })
        );
        setEquipments(data);
        setFilteredEquipments(data);
      }
    } catch (err) {
      console.log(err);
      alert("Fail to fetch equipments!");
    } finally {
      setLoading(false);
    }
  };

  const fetchEquipmentType = async () => {
    try {
      const response = await axios.get(`${API_PATH}/Device/device-types`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response) {
        setEquipmentType(response.data.$values);
      }
    } catch (err) {
      alert(err?.response?.data?.Message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchEquipments(), fetchEquipmentType()]);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const {
      searchtext,
      selectedEquipmentType,
      selectedStatus,
      minPrice,
      maxPrice,
    } = filters;
    const data = equipments.filter((equipment) => {
      const matchesSearch = equipment.name
        .toLowerCase()
        .includes(searchtext.toLowerCase());
      const matchesStatus =
        selectedStatus === "" || equipment.status === selectedStatus;
      const matchesType =
        selectedEquipmentType === "" ||
        equipment.type === selectedEquipmentType;
      const matchesMinPrice =
        minPrice === null || minPrice <= equipment.rentalFee;
      const matchesMaxPrice =
        maxPrice === null || maxPrice >= equipment.rentalFee;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType &&
        matchesMinPrice &&
        matchesMaxPrice
      );
    });

    setFilteredEquipments(data);
  }, [filters, equipments]);

  if (loading)
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

  return (
    <div className="p-5">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-5">Manage Equipments</h3>
      </div>
      <EquipmentFilters
        filters={filters}
        setFilters={setFilters}
        equipmentType={equipmentType}
        navigate={navigate}
      />
      <DataTable columns={columns} data={filteredEquipments} pagination />;
    </div>
  );
};

export default EquipmentsList;
