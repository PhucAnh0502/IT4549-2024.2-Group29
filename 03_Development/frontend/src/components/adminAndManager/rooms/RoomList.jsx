import React, { useEffect, useState } from "react";
import { getAllRooms } from "../../../utils/RoomHelper";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import RoomFilters from "./RoomFilters";
import RoomButtons from "./RoomButtons";
import { columns } from "./RoomColumns";

const RoomList = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [filteredRoom, setFilteredRoom] = useState([]);
  const [searchtext, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedRoomType, setSelectedRoomType] = useState("");

  const role = localStorage.getItem('accountRole').toLowerCase()

  const onRoomRefresh = () => {
    fetchRooms();
  };

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const rooms = await getAllRooms();
      if (rooms) {
        let sno = 1;
        const data = rooms.map((room) => ({
          id: room.id,
          sno: sno++,
          roomCode: room.roomCode,
          name: room.name,
          roomType: room.roomType,
          capacity: room.capacity,
          status: room.status,
          numOfDevices: room.devices.length,
          action: <RoomButtons id={room.id} onRoomRefresh={onRoomRefresh} />,
        }));
        setRooms(data);
        setFilteredRoom(data);
      }
    } catch (err) {
      alert(err.response?.data?.Message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === "status") {
      setSelectedStatus(value);
    } else if (name === "roomType") {
      setSelectedRoomType(value);
    }
  };

  const handleAddRoom = () => {
    navigate(`/${role}-dashboard/rooms/add-room`);
  };

  const filterRooms = (search, type, status) => {
    const data = rooms.filter((room) => {
      const matchesSearch = room.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesStatus = status === "" || room.status.toString() === status;
      const matchesType = type === "" || room.roomType.toString() === type;
      return matchesSearch && matchesStatus && matchesType;
    });
    setFilteredRoom(data);
  };

  useEffect(() => {
    filterRooms(searchtext, selectedRoomType, selectedStatus);
  }, [searchtext, selectedRoomType, selectedStatus]);

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
        <h3 className="text-2xl font-bold mb-5">Manage Rooms</h3>
      </div>

      <RoomFilters
        searchtext={searchtext}
        selectedStatus={selectedStatus}
        selectedRoomType={selectedRoomType}
        handleSearchChange={handleSearchChange}
        handleFilterChange={handleFilterChange}
        handleAddRoom={handleAddRoom}
      />

      <div className="mt-5">
        <DataTable columns={columns} data={filteredRoom} pagination />
      </div>
    </div>
  );
};

export default RoomList;
