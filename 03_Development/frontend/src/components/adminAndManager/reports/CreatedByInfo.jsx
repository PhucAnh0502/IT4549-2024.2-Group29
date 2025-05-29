import React from "react";

const CreatedByInfo = ({ createdByUser }) => {
  return (
    <div className="mt-6 border-t border-black-300 pt-4">
      <h2 className="text-xl font-semibold text-red-600 mb-2 text-center">
        Created By
      </h2>
      <div className="space-y-2 text-gray-700">
        <div>
          <span className="font-semibold">Name:</span>{" "}
          {createdByUser?.firstName} {createdByUser?.lastName}
        </div>
        <div>
          <span className="font-semibold">Date of Birth:</span>{" "}
          {createdByUser?.dateOfBirth
            ? new Date(createdByUser.dateOfBirth).toLocaleDateString()
            : "N/A"}
        </div>
        <div>
          <span className="font-semibold">Current Balance:</span>{" "}
          {createdByUser?.currentBalance ?? "N/A"}
        </div>
      </div>
    </div>
  );
};

export default CreatedByInfo;
