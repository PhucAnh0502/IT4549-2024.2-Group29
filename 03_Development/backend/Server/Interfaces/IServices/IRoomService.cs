using Server.DTOs.Room;
using Server.Enums.Room;
using Server.Models.Room;

namespace Server.Interfaces.IServices
{
    public interface IRoomService
    {
        public Task CreateRoomAsync(CreateRoomDTO createRoomDTO);
        public Task<RoomModel> GetRoomByIdAsync(Guid roomId);
        public Task<RoomModel> UpdateRoomAsync(RoomModel roomModel);
        public Task DeleteRoomAsync(Guid roomId);
        public Task<List<RoomModel>> GetRoomsAsync();
        public Task<List<string>> GetAllRoomCodesByRoomType(RoomTypeCode roomType);
        public Task<List<RoomModel>> GetRoomsByTypeAsync(RoomTypeCode roomType);
        public Task PutRoomUnderMaintenanceAsync(Guid roomId);
        public Task PutRoomAvailableAsync(Guid roomId);
    }
}