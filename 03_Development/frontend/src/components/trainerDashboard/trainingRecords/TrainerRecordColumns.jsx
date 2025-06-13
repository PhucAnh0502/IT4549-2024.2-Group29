export const columns = [
  {
    name: "S No",
    selector: (row) => row.sno,
    width: "90px",
    center: true,
  },
  {
    name: "Progress",
    selector: (row) => row.progress,
    width: "740px",
  },
  {
    name: "Action",
    selector: (row) => row.action,
    center: true,
  },
];
