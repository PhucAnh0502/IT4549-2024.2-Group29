export const columns = [
  {
    name: "S No",
    selector: (row) => row.sno,
    width: "90px",
    center: "true",
  },
  {
    name: "Name",
    selector: (row) => row.name,
    sortable: true,
    width: "240px",
  },
  {
    name: "DOB",
    selector: (row) => row.dob,
    width: "180px",
  },
  {
    name: "Email",
    selector: (row) => row.email,
    width: "280px",
  },
  {
    name: "Role",
    selector: (row) => row.role,
    cell: (row) => (
      <span
        className={`px-3 py-1 rounded-full text-white text-sm font-semibold
        ${
          row.role === "Manager"
            ? "bg-yellow-600"
            : row.role === "Member"
            ? "bg-blue-500"
            : row.role === "Trainer"
            ? "bg-emerald-500"
            : "bg-gray-400"
        }`}
      >
        {row.role}
      </span>
    ),
    center: true,
    width: "140px",
  },
  {
    name: "Action",
    selector: (row) => row.action,
    center: "true",
  },
];
