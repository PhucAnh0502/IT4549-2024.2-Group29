namespace Server.DTOs.Device
{
    public class AddDeviceDTO
    {
        public required string Name { get; set; }
        public required string DeviceType { get; set; }
        public required string Manufacturer { get; set; }
        public required DateTime DateOfPurchase { get; set; }
        public required int WarrantyPeriod { get; set; }
        public required float RentalFee { get; set; }
        public required string RoomCode { get; set; }
    }
}