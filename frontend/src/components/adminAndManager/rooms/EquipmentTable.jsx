import React from "react";

const formatText = (text) =>
  text ? text.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/\b\w/g, (c) => c.toUpperCase()) : "";

const EquipmentTable = ({ devices }) => (
  <>
    <h2 className="text-2xl font-bold mb-4 text-center">Equipments in Room</h2>
    {devices.length === 0 ? (
      <p className="text-gray-500 italic">No equipments assigned to this room.</p>
    ) : (
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-red-400 text-white text-sm text-center">
              <th className="px-4 py-3">Device Code</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Manufacturer</th>
              <th className="px-4 py-3">Purchase Date</th>
              <th className="px-4 py-3">Warranty</th>
              <th className="px-4 py-3">Rental Fee</th>
              <th className="px-4 py-3">Last Maintenance</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((device) => (
              <tr key={device.id} className="border-t text-sm text-center even:bg-gray-50 hover:bg-red-50 transition-colors">
                <td className="px-4 py-2">{device.deviceCode}</td>
                <td className="px-4 py-2">{device.name}</td>
                <td className="px-4 py-2">{formatText(device.deviceType)}</td>
                <td className="px-4 py-2">{device.manufacturer}</td>
                <td className="px-4 py-2">{new Date(device.dateOfPurchase).toLocaleDateString()}</td>
                <td className="px-4 py-2">{device.warrantyPeriod}</td>
                <td className="px-4 py-2">{device.rentalFee.toLocaleString()}</td>
                <td className="px-4 py-2">{new Date(device.lastMaintenance).toLocaleDateString()}</td>
                <td className="px-4 py-2">{device.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </>
);

export default EquipmentTable;
