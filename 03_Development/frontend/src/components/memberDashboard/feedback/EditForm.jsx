import React from "react";

const EditForm = ({ feedback, setFeedback }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeedback((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={feedback.title || ""}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          required
        />
      </div>

      <div>
        <label
          htmlFor="reportType"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Report Type
        </label>
        <select
          id="reportType"
          name="reportType"
          value={feedback.reportType || 0}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          required
        >
          <option value={0}>Equipment</option>
          <option value={1}>User</option>
          <option value={2}>Training Record</option>
          <option value={3}>Course</option>
          <option value={4}>Room</option>
          <option value={5}>Environment</option>
          <option value={6}>Other</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Content
        </label>
        <textarea
          id="content"
          name="content"
          value={feedback.content || ""}
          onChange={handleChange}
          rows="6"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          required
        />
      </div>
    </div>
  );
};

export default EditForm; 