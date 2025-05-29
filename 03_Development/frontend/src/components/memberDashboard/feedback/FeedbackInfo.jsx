import React from "react";

const FeedbackInfo = ({ feedback }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case 0:
        return "bg-yellow-100 text-yellow-800";
      case 1:
        return "bg-green-100 text-green-800";
      case 2:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return "Pending";
      case 1:
        return "Resolved";
      case 2:
        return "Rejected";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Content</h3>
        <p className="text-gray-700 whitespace-pre-wrap">{feedback.content}</p>
      </div>

      <div className="flex items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Status</h3>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(
              feedback.status
            )}`}
          >
            {getStatusText(feedback.status)}
          </span>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Created At</h3>
          <p className="text-gray-700">
            {new Date(feedback.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeedbackInfo; 