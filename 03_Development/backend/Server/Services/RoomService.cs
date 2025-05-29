using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.DTOs.Room;
using Server.Enums.Device;
using Server.Enums.ErrorCodes;
using Server.Enums.Room;
using Server.Interfaces.IServices;
using Server.Middlewares;
using Server.Models.Room;

namespace Server.Services
{
    public class RoomService(DatabaseContext context) : IRoomService
    {

        private readonly DatabaseContext _context = context;
        public async Task CreateRoomAsync(CreateRoomDTO createRoomDTO)
        {
            string roomTypePrefix = createRoomDTO.RoomType.ToString().Substring(0, 2).ToUpper();
            string roomCode = $"{roomTypePrefix}-{createRoomDTO.RoomNumber}";
            if (await _context.Rooms.AnyAsync(r => r.RoomCode == roomCode))
            {
                throw new RoomException(RoomErrorCode.RoomAlreadyExist, "Room already exist.");
            }

            var room = new RoomModel
            {
                Id = Guid.NewGuid(),
                Name = createRoomDTO.RoomName,
                RoomType = createRoomDTO.RoomType.ToString(),
                RoomCode = roomCode,
                Capacity = Convert.ToInt32(RoomMaxCapacity.MaxCapacity),
                Status = RoomStatusCode.Available.ToString(),
                Devices = []
            };

            await _context.Rooms.AddAsync(room);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteRoomAsync(Guid roomId)
        {
            var room = await _context.Rooms.FirstOrDefaultAsync(r => r.Id == roomId) 
                                            ?? throw new RoomException(RoomErrorCode.RoomNotFound, "Room not found.");
            _context.Rooms.Remove(room);
            await _context.SaveChangesAsync();
        }

        public async Task<List<string>> GetAllRoomCodesByRoomType(RoomTypeCode roomType)
        {
            var roomTypeString = roomType.ToString();
            var roomCodes = await _context.Rooms
                .Where(r => r.RoomType == roomTypeString)
                .Select(r => r.RoomCode)
                .ToListAsync();
            if (roomCodes == null || roomCodes.Count == 0)
            {
                throw new RoomException(RoomErrorCode.RoomNotFound, "Rooms not found.");
            }
            return roomCodes;
        }

        public async Task<RoomModel> GetRoomByIdAsync(Guid roomId)
        {
            var room = await _context.Rooms
                            .Include(a => a.Devices)
                            .FirstOrDefaultAsync(r => r.Id == roomId) 
                                            ?? throw new RoomException(RoomErrorCode.RoomNotFound, "Room not found.");
            return room;
        }

        public async Task<List<RoomModel>> GetRoomsAsync()
        {
            var rooms = await _context.Rooms.Include(a => a.Devices).ToListAsync() 
                                            ?? throw new RoomException(RoomErrorCode.RoomNotFound, "Room not found.");
            return rooms;
        }

        public async Task<List<RoomModel>> GetRoomsByTypeAsync(RoomTypeCode roomType)
        {
            var rooms = await _context.Rooms.Where(r => r.RoomType == roomType.ToString()).ToListAsync() 
                                            ?? throw new RoomException(RoomErrorCode.RoomNotFound, "Room not found.");
            return rooms;
        }

        public async Task PutRoomAvailableAsync(Guid roomId)
        {
            var room = await _context.Rooms.FirstOrDefaultAsync(r => r.Id == roomId) 
                                            ?? throw new RoomException(RoomErrorCode.RoomNotFound, "Room not found.");
            if (room.Status == RoomStatusCode.Available.ToString())
            {
                throw new RoomException(RoomErrorCode.RoomAlreadyAvailable, "Room already available.");
            }
            room.Status = RoomStatusCode.Available.ToString();
            var devices = await _context.Devices.Where(d => d.RoomId == roomId).ToListAsync();
            foreach (var device in devices)
            {
                device.Status = DeviceStatusCode.Available.ToString();
            }
            await _context.SaveChangesAsync();
        }

        public async Task PutRoomUnderMaintenanceAsync(Guid roomId)
        {
            var room = await _context.Rooms.FirstOrDefaultAsync(r => r.Id == roomId) 
                                            ?? throw new RoomException(RoomErrorCode.RoomNotFound, "Room not found.");
            if (room.Status == RoomStatusCode.UnderMaintenance.ToString())
            {
                throw new RoomException(RoomErrorCode.RoomAlreadyUnderMaintenance, "Room already under maintenance.");
            }
            room.Status = RoomStatusCode.UnderMaintenance.ToString();
            var devices = await _context.Devices.Where(d => d.RoomId == roomId).ToListAsync();
            foreach (var device in devices)
            {
                device.Status = DeviceStatusCode.UnderMaintenance.ToString();
            }
            await _context.SaveChangesAsync(); 
        }


        //tham khảo sau
        public Task<RoomModel> UpdateRoomAsync(RoomModel roomModel)
        {
            throw new NotImplementedException();
        }
    }
}