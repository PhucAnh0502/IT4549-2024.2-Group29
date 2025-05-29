import React from "react";

const EditForm = ({ report, setReport }) => {
  return (
    <>
      <div>
        <label className="block font-semibold mb-1">Title:</label>
        <input
          type="text"
          value={report.title || ""}
          onChange={(e) => setReport({ ...report, title: e.target.value })}
          required
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="font-semibold block mb-1">Report Type:</label>
        <select
          value={report.reportType}
          onChange={(e) => setReport({ ...report, reportType: e.target.value })}
          required
          className="w-full p-2 border rounded-lg"
        >
          <option value="0">Equipment</option>
          <option value="1">User</option>
          <option value="2">Training Record</option>
          <option value="3">Course</option>
          <option value="4">Room</option>
          <option value="5">Environment</option>
          <option value="6">Other</option>
        </select>
      </div>

      <div>
        <label className="block font-semibold mb-1">Content:</label>
        <textarea
          value={report.content || ""}
          onChange={(e) => setReport({ ...report, content: e.target.value })}
          required
          className="w-full border rounded px-3 py-2"
        />
      </div>
    </>
  );
};

export default EditForm;
