using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.DTOs.Room;
using Server.Enums.Room;
using Server.Interfaces.IServices;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class RoomController : ControllerBase
    {
        private readonly IRoomService _roomService;
        public RoomController(IRoomService roomService)
        {
            _roomService = roomService;
        }

        [Authorize(Roles = "Admin, Manager")]
        [HttpPost("create")]
        public async Task<IActionResult> CreateRoom([FromBody] CreateRoomDTO model)
        {
            var department = User.FindFirst("department")?.Value;
            if (department == null || department == "Equipment")
            {
                await _roomService.CreateRoomAsync(model);
                return Ok(new { message = "Create room successful" });
            }
            return Forbid();
        }

        [HttpGet("all-room")]
        public async Task<IActionResult> GetAllRoom()
        {
            var rooms = await _roomService.GetRoomsAsync();
            return Ok(rooms);
        }

        [HttpGet("room/{roomId}")]
        public async Task<IActionResult> GetRoomById(Guid roomId)
        {
            var room = await _roomService.GetRoomByIdAsync(roomId);
            return Ok(room);
        }

        [Authorize(Roles = "Admin, Manager")]
        [HttpDelete("delete/{roomId}")]
        public async Task<IActionResult> DeleteRoom(Guid roomId)
        {
            var department = User.FindFirst("department")?.Value;
            if (department == null || department == "Equipment")
            {
                await _roomService.DeleteRoomAsync(roomId);
                return Ok(new { message = "Delete room successful" });
            }
            return Forbid();
        }

        [HttpGet("room-type/{roomType}")]
        public async Task<IActionResult> GetRoomsByType(RoomTypeCode roomType)
        {
            var rooms = await _roomService.GetRoomsByTypeAsync(roomType);
            return Ok(rooms);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("available/{roomId}")]
        public async Task<IActionResult> PutRoomAvailable(Guid roomId)
        {
            var department = User.FindFirst("department")?.Value;
            if (department == null || department == "Equipment")
            {
                await _roomService.PutRoomAvailableAsync(roomId);
                return Ok(new { message = "Room is available" });
            }
            return Forbid();
        }

        [Authorize(Roles = "Admin, Manager")]
        [HttpPut("maintenance/{roomId}")]
        public async Task<IActionResult> PutRoomUnderMaintenance(Guid roomId)
        {
            var department = User.FindFirst("department")?.Value;
            if (department == null || department == "Equipment")
            {
                await _roomService.PutRoomUnderMaintenanceAsync(roomId);
                return Ok(new { message = "Room is under maintenance" });
            }
            return Forbid();
        }

        [HttpGet("room-code/{roomType}")]
        [Authorize(Roles = "Admin, Manager")]
        public async Task<IActionResult> GetAllRoomCodesByRoomType(RoomTypeCode roomType)
        {
            var department = User.FindFirst("department")?.Value;
            if (department == null || department == "Equipment")
            {
                var roomCodes = await _roomService.GetAllRoomCodesByRoomType(roomType);
                return Ok(roomCodes);
            }
            return Forbid();
        }
    }
}