using Server.Enums.Room;

namespace Server.DTOs.Room
{
    public class CreateRoomDTO
    {
        public required string RoomName { get; set; }
        public required RoomTypeCode RoomType { get; set; }
        public required int RoomNumber { get; set; }
    }
}