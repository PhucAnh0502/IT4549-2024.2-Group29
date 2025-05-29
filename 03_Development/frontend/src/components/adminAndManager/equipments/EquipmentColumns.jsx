export const columns = [
    {
      name: "S No",
      selector: (row) => row.sno,
      center: "true",
      width: "60px"
    },
    {
      name: "Code",
      selector: (row) => row.code,
      width: "130px"
    },
    {
      name: "Name",
      selector: (row) => row.name,
      width: "160px"
    },
    {
      name: "Type",
      selector: (row) => row.type,
      width: "160px"
    },
    {
      name: "Manufacturer",
      selector: (row) => row.manufacturer,
      width: "140px"
    },
    {
      name: "Warranty",
      selector: (row) => row.warrantyPeriod,
      width: "90px",
      center : 'true'
    },
    {
      name: "Rental Fee",
      selector: (row) => row.rentalFee,
      width: "100px",
      center : 'true'
    },
    {
      name: "Status",
      selector: (row) => row.status,
      width: "100px",
      center : 'true'
    },
    {
      name: "Room",
      selector: (row) => row.room,
      width: "100px",
    },
    {
      name: "Action",
      selector: (row) => row.action,
      center : 'true'
    },
  ];