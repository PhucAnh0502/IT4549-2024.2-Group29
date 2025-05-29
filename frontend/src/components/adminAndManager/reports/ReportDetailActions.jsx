import React, { useEffect, useState } from "react";

const ReportDetailActions = ({
  isEditing,
  onSave,
  onEdit,
  onResolve,
  onReject,
  createdUserId,
}) => {
  const userId = localStorage.getItem("userId");
  const [isCreated, setIsCreated] = useState(false);

  useEffect(() => {
    if (userId == createdUserId) {
      setIsCreated(true);
    } else {
      setIsCreated(false);
    }
  }, [userId, createdUserId]);
  return (
    <div className="mt-6 flex justify-center gap-8">
      {isEditing ? (
        <button
          onClick={onSave}
          className="flex-1 max-w-[120px] px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Save
        </button>
      ) : (
        <>
          {isCreated && (
            <button
              onClick={onEdit}
              className="flex-1 max-w-[120px] px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Edit
            </button>
          )}

          <button
            onClick={onResolve}
            className="flex-1 max-w-[120px] px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Resolve
          </button>

          <button
            onClick={onReject}
            className="flex-1 max-w-[120px] px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Reject
          </button>
        </>
      )}
    </div>
  );
};

export default ReportDetailActions;
