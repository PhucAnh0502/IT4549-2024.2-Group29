using System.Text.Json.Serialization;
using Server.Models.Room;

namespace Server.Models.Device
{
    public class DeviceModel
    {
        public Guid Id { get; set; }
        public required string DeviceCode { get; set; }
        public required string Name { get; set; }
        public required string DeviceType { get; set; }
        public required string Manufacturer { get; set; }
        public required DateTime DateOfPurchase { get; set; }
        public required int WarrantyPeriod { get; set; }
        public required float RentalFee { get; set; }
        public required DateTime LastMaintenance { get; set; }
        public required string Status { get; set; }

        // Foreign key
        public Guid RoomId { get; set; }
        [JsonIgnore]
        public RoomModel Room { get; set; } = null!;
    }
}