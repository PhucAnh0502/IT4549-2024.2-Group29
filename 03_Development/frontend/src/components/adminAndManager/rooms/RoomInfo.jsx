import React from "react";

const formatText = (text) =>
  text ? text.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/\b\w/g, (c) => c.toUpperCase()) : "";

const RoomInfo = ({ room }) => (
  <>
    <h2 className="text-2xl font-bold mb-4 text-center">Room Information</h2>
    <table className="w-full border border-gray-300 shadow-md rounded-lg overflow-hidden mb-8">
      <tbody>
        <tr className="even:bg-gray-50 border-b">
          <td className="p-3 font-semibold text-gray-700">Room Code</td>
          <td className="p-3 text-gray-800">{room.roomCode}</td>
        </tr>
        <tr className="even:bg-gray-50 border-b">
          <td className="p-3 font-semibold text-gray-700">Name</td>
          <td className="p-3 text-gray-800">{room.name}</td>
        </tr>
        <tr className="even:bg-gray-50 border-b">
          <td className="p-3 font-semibold text-gray-700">Room Type</td>
          <td className="p-3 text-gray-800">{formatText(room.roomType)}</td>
        </tr>
        <tr className="even:bg-gray-50 border-b">
          <td className="p-3 font-semibold text-gray-700">Capacity</td>
          <td className="p-3 text-gray-800">{room.capacity}</td>
        </tr>
        <tr className="even:bg-gray-50">
          <td className="p-3 font-semibold text-gray-700">Status</td>
          <td className="p-3 text-gray-800">{room.status}</td>
        </tr>
      </tbody>
    </table>
  </>
);

export default RoomInfo;
