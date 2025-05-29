import React from "react";

const FeedbackDetailActions = ({
  isEditing,
  onSave,
  onEdit,
  onDelete,
  canEdit,
}) => {
  return (
    <div className="flex justify-end gap-4 mt-6 pt-4 border-t">
      {isEditing ? (
        <button
          onClick={onSave}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          Save Changes
        </button>
      ) : (
        <>
          {canEdit && (
            <button
              onClick={onEdit}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Edit
            </button>
          )}
          <button
            onClick={onDelete}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </>
      )}
    </div>
  );
};

export default FeedbackDetailActions;