import React from "react";

const EditUserInfo = ({
  editedUserInfo,
  setEditedUserInfo,
  handleSaveChanges,
  setIsEditing,
}) => {
  const role = localStorage.getItem("accountRole");
  return (
    <div className="pt-6 border-t border-gray-200 space-y-6">
      <div className="flex">
        <label className="w-1/3 text-gray-600 font-medium">First Name:</label>
        <input
          type="text"
          value={editedUserInfo.firstName || ""}
          onChange={(e) =>
            setEditedUserInfo({ ...editedUserInfo, firstName: e.target.value })
          }
          className="text-gray-900 border rounded-lg p-2 w-full"
        />
      </div>
      <div className="flex">
        <label className="w-1/3 text-gray-600 font-medium">Last Name:</label>
        <input
          type="text"
          value={editedUserInfo.lastName || ""}
          onChange={(e) =>
            setEditedUserInfo({ ...editedUserInfo, lastName: e.target.value })
          }
          className="text-gray-900 border rounded-lg p-2 w-full"
        />
      </div>
      {role === "Manager" && (
        <div className="flex">
          <label className="w-1/3 text-gray-600 font-medium">Department:</label>
          <select
            name="department"
            className="text-gray-900 border rounded-lg p-2 w-full"
            value={editedUserInfo.department}
            onChange={(e) => {
              setEditedUserInfo({
                ...editedUserInfo,
                department: e.target.value,
              });
            }}
            required
          >
            <option value="">Select department</option>
            <option value="HR">HR</option>
            <option value="Finance">Finance</option>
            <option value="Equipment">Equipment</option>
            <option value="Support">Support</option>
          </select>
        </div>
      )}
      <div className="flex">
        <label className="w-1/3 text-gray-600 font-medium">
          Date of Birth:
        </label>
        <input
          type="date"
          value={editedUserInfo.dateOfBirth || ""}
          onChange={(e) =>
            setEditedUserInfo({
              ...editedUserInfo,
              dateOfBirth: e.target.value,
            })
          }
          className="text-gray-900 border rounded-lg p-2 w-full"
        />
      </div>

      <div className="flex justify-center gap-6 pt-6">
        <button
          onClick={handleSaveChanges}
          className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition text-sm font-medium"
        >
          Save Changes
        </button>
        <button
          onClick={() => setIsEditing(false)}
          className="bg-gray-500 text-white px-5 py-2 rounded-lg hover:bg-gray-600 transition text-sm font-medium"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditUserInfo;
