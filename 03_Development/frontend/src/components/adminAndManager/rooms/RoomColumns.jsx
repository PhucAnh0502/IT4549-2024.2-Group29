export const columns = [
  {
    name: "S No",
    selector: (row) => row.sno,
    center: "true",
    width: "70px",
  },
  {
    name: "Code",
    selector: (row) => row.roomCode,
    width: "90px",
  },
  {
    name: "Name",
    selector: (row) => row.name,
    width: "200px",
  },
  {
    name: "Room Type",
    selector: (row) => row.roomType,
    width: "150px",
  },
  {
    name: "Capacity",
    selector: (row) => row.capacity,
    center: "true",
    width: "100px",
  },
  {
    name: "Status",
    cell: (row) => {
      const statusStyleMap = {
        Available: "bg-green-100 text-green-800",
        Full: "bg-red-100 text-red-800",
        Reserved: "bg-gray-100 text-gray-800",
        UnderMaintenance: "bg-yellow-100 text-yellow-800",
      };

      const style = statusStyleMap[row.status] || "bg-gray-100 text-gray-800";

      return (
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${style}`}
        >
          {row.status}
        </span>
      );
    },
    center: true,
    width: "180px",
  },
  {
    name: "Equipments",
    selector: (row) => row.numOfDevices,
    center: "true",
    width: "100px",
  },
  {
    name: "Action",
    selector: (row) => row.action,
    center: "true",
  },
];
