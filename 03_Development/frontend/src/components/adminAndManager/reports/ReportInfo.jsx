import React from "react";

const splitCamelCase = (str) => {
  return str
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2");
};

const ReportInfo = ({ report }) => {
  return (
    <>
      <p>
        <strong className="font-semibold">Report Type:</strong>{" "}
        {report.reportType ? splitCamelCase(report.reportType) : "N/A"}
      </p>
      <p>
        <strong className="font-semibold">Content:</strong> {report.content}
      </p>
      <p>
        <strong className="font-semibold">Status:</strong> {report.status}
      </p>
      <p>
        <strong className="font-semibold">Created At:</strong>{" "}
        {report.createdAt ? new Date(report.createdAt).toLocaleString() : "N/A"}
      </p>
    </>
  );
};

export default ReportInfo;
