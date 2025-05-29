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
      center: "true"
    },
    {
      name: "Action",
      selector: (row) => row.action,
      center: "true",
    },
  ]