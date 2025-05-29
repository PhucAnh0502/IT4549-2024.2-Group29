namespace Server.DTOs.Device
{
    public class BookDeviceDTO
    {
        public Guid DeviceId { get; set; }
        public Guid UserId { get; set; }
        public TimeSpan From { get; set; }
        public TimeSpan To { get; set; }
        public DateOnly BookingDate { get; set; }
    }
}