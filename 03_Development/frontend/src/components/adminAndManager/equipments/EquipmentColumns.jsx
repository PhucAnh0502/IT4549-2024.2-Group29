export const columns = [
  {
    name: "S No",
    selector: (row) => row.sno,
    center: "true",
    width: "60px",
  },
  {
    name: "Code",
    selector: (row) => row.code,
    width: "130px",
  },
  {
    name: "Name",
    selector: (row) => row.name,
    width: "160px",
  },
  {
    name: "Type",
    selector: (row) => row.type,
    width: "160px",
  },
  {
    name: "Manufacturer",
    selector: (row) => row.manufacturer,
    width: "140px",
  },
  {
    name: "Warranty",
    selector: (row) => row.warrantyPeriod,
    width: "90px",
    center: "true",
  },
  {
    name: "Rental Fee",
    selector: (row) => row.rentalFee,
    width: "100px",
    center: "true",
  },
  {
    name: "Status",
    cell: (row) => {
      const status = row.status;

      const statusStyles = {
        Available: "bg-green-100 text-green-700",
        InUse: "bg-yellow-100 text-yellow-700",
        NeedMaintainence: "bg-orange-100 text-orange-700",
        UnderMaintenance: "bg-blue-100 text-blue-700",
        OutOfService: "bg-red-100 text-red-700",
        Using: "bg-purple-100 text-purple-700",
      };

      return (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold capitalize whitespace-nowrap ${
            statusStyles[status] || "bg-gray-100 text-gray-700"
          }`}
        >
          {status}
        </span>
      );
    },
    width: "140px",
    center: true,
  },
  {
    name: "Room",
    selector: (row) => row.room,
    width: "100px",
  },
  {
    name: "Action",
    selector: (row) => row.action,
    center: "true",
  },
];
