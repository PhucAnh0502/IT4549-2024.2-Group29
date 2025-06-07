export const columns = [
  {
    name: "S No",
    selector: (row) => row.sno,
    center: "true",
    width: "60px",
  },
  {
    name: "Title",
    selector: (row) => row.title,
    width: "200px",
  },
  {
    name: "Type",
    cell: (row) => {
      const typeStyleMap = {
        Equipment: "bg-blue-100 text-blue-800",
        User: "bg-green-100 text-green-800",
        TrainingRecord: "bg-yellow-100 text-yellow-800",
        Course: "bg-purple-100 text-purple-800",
        Room: "bg-indigo-100 text-indigo-800",
        Environment: "bg-pink-100 text-pink-800",
        Other: "bg-gray-100 text-gray-800",
      };

      const style = typeStyleMap[row.reportType] || "bg-gray-100 text-gray-500";

      return (
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${style} whitespace-nowrap`}
        >
          {row.reportType}
        </span>
      );
    },
    center: true,
    width: "180px",
  },
  {
    name: "Status",
    cell: (row) => {
      const statusStyleMap = {
        pending: "bg-yellow-100 text-yellow-800",
        resolved: "bg-green-100 text-green-800",
        rejected: "bg-red-100 text-red-800",
      };

      const status = row.status?.toLowerCase();
      const style = statusStyleMap[status] || "bg-gray-100 text-gray-800";

      return (
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${style} whitespace-nowrap`}
        >
          {row.status}
        </span>
      );
    },
    center: true,
    width: "160px",
  },
  {
    name: "Created At",
    selector: (row) => row.createdAt,
    width: "160px",
    center: "true",
  },
  {
    name: "Created By",
    selector: (row) => row.createdBy,
    width: "160px",
    center: "true",
  },
  {
    name: "Action",
    selector: (row) => row.action,
    center: "true",
  },
];
