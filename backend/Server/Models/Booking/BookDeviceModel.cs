using Server.Models.Device;
using Server.Models.User;

namespace Server.Models.Booking
{
    public class BookDeviceModel
    {
        public Guid Id { get; set; }
        public Guid DeviceId { get; set; }
        public Guid UserId { get; set; }
        public DateOnly BookingDate { get; set; }
        public TimeSpan From { get; set; }
        public TimeSpan To { get; set; }
        public float Fee { get; set; }
        public required string Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public required DeviceModel Device { get; set; }
        public required UserBaseModel User { get; set; }
    }
}