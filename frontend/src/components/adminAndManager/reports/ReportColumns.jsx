export const columns = [
    {
        name : "S No",
        selector: (row) => row.sno,
        center : "true",
        width : '60px'
    },
    {
        name : "Title",
        selector: (row) => row.title,
        width : '200px'
    },
    {
        name : "Type",
        selector: (row) => row.reportType,
        center : "true",
        width : '160px'
    },
    {
        name : "Status",
        selector: (row) => row.status,
        center : "true",
        width : '160px'
    },
    {
        name : "Created At",
        selector: (row) => row.createdAt,
        width : '160px',
        center : 'true'
    },
    {
        name : "Created By",
        selector: (row) => row.createdBy,
        width : '160px',
        center : 'true'
    },
    {
        name : "Action",
        selector: (row) => row.action,
        center : "true"
    },
]