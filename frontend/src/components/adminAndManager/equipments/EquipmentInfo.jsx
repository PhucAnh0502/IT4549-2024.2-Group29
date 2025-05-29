const EquipmentInfo = ({ equipment, splitCamelCase }) => (
    <div className="space-y-4 text-gray-700">
      <p><strong>Device Code:</strong> {equipment.deviceCode}</p>
      <p><strong>Device Type:</strong> {splitCamelCase(equipment.deviceType)}</p>
      <p><strong>Manufacturer:</strong> {equipment.manufacturer}</p>
      <p><strong>Date of Purchase:</strong> {new Date(equipment.dateOfPurchase).toLocaleDateString()}</p>
      <p><strong>Warranty Period:</strong> {equipment.warrantyPeriod}</p>
      <p><strong>Rental Fee:</strong> {equipment.rentalFee}</p>
      <p><strong>Last Maintenance:</strong> {new Date(equipment.lastMaintenance).toLocaleDateString()}</p>
      <p><strong>Status:</strong> {splitCamelCase(equipment.status)}</p>
    </div>
  );
  
  export default EquipmentInfo;
  