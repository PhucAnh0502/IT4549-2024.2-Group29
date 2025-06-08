export const columns = [
  {
    name: "S No",
    selector: (row) => row.sno,
    center: true,
    width: "70px",
  },
  {
    name: "Name",
    selector: (row) => row.name,
    sortable: true,
    width: "160px",
  },
  {
    name: "Type",
    selector: (row) => row.type,
    sortable: true,
    width: "110px",
  },
  {
    name: "Start Date",
    selector: (row) => row.startDate,
    width: "110px",
  },
  {
    name: "End Date",
    selector: (row) => row.endDate,
    center: true,
    width: "110px",
  },
  {
    name: "Start Time",
    selector: (row) => row.startTime,
    width: "110px",
    center: true,
  },
  {
    name: "End Time",
    selector: (row) => row.endTime,
    width: "110px",
    center: true,
  },
  {
    name: "Status",
    cell: (row) => {
      const status = row.status?.toLowerCase() || "unknown";

      const statusClass = {
        upcoming: "bg-blue-100 text-blue-700",
        "on going": "bg-yellow-100 text-yellow-700",
        completed: "bg-green-100 text-green-700",
        cancelled: "bg-red-100 text-red-700",
      };

      return (
        <span
          className={`px-3 py-1 mt-2 mb-2 rounded-full text-xs font-semibold capitalize ${
            statusClass[status] || "bg-gray-100 text-gray-600"
          }`}
        >
          {row.status}
        </span>
      );
    },
    width: "130px",
  },
  {
    name: "Action",
    cell: (row) => row.action, 
    center: true,
    width: "140px",
  },
];
