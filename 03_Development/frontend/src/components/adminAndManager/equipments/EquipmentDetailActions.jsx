import React from "react";

const EquipmentDetailActions = ({
  equipment,
  navigate,
  onBook,
  onEnable,
  onDisable,
}) => {
  const role = localStorage.getItem("accountRole")?.toLowerCase();
  const department = localStorage.getItem("department");

  const canViewRoom = role === "member" || role === "admin" || role === "manager";
  const canBook = canViewRoom; // tất cả các vai trò trên đều có thể book
  const canManage = (role === "admin" || role === "manager") && 
                    (department === null || department === "Equipment");

  return (
    <div className="mt-6 flex flex-wrap gap-4">
      {/* View Room Detail */}
      {canViewRoom && (
        <button
          onClick={() =>
            navigate(`/${role}-dashboard/rooms/${equipment?.roomId}`)
          }
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          View Room Detail
        </button>
      )}

      {/* Book */}
      {canBook && (
        <button
          onClick={onBook}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Book
        </button>
      )}

      {/* Enable/Disable chỉ dành cho Admin/Manager thuộc phòng Equipment */}
      {canManage && (
        <>
          <button
            onClick={onEnable}
            className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition"
          >
            Enable
          </button>

          <button
            onClick={onDisable}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Disable
          </button>
        </>
      )}
    </div>
  );
};

export default EquipmentDetailActions;
