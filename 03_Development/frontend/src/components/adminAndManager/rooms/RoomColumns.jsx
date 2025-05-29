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
      width: "180px",
    },
    {
      name: "Room Type",
      selector: (row) => row.roomType,
      width: "130px",
    },
    {
      name: "Capacity",
      selector: (row) => row.capacity,
      center: "true",
      width: "90px",
    },
    {
      name: "Status",
      selector: (row) => row.status,
      center: "true",
      width: "150px",
    },
    {
      name: "Equipments",
      selector: (row) => row.numOfDevices,
      center: "true",
      width: "90px",
    },
    {
      name: "Action",
      selector: (row) => row.action,
      center: "true",
    },
  ];