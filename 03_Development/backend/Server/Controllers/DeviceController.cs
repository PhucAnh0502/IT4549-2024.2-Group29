using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.DTOs.Device;
using Server.Enums.Room;
using Server.Interfaces.IServices;

namespace Server.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class DeviceController : ControllerBase
    {
        private readonly IDeviceService _deviceService;
        public DeviceController(IDeviceService deviceService)
        {
            _deviceService = deviceService;
        }

        [HttpGet("get-device-by-id/{deviceId}")]
        public async Task<IActionResult> GetDeviceById(Guid deviceId)
        {
            var device = await _deviceService.GetDeviceByIdAsync(deviceId);
            if (device == null)
                return NotFound(new { message = "Device not found" });
            return Ok(device);
        }

        [HttpGet("get-devices")]
        public async Task<IActionResult> GetDevices()
        {
            var devices = await _deviceService.GetDevicesAsync();
            if (devices == null || devices.Count == 0)
                return NotFound(new { message = "No devices found" });
            return Ok(devices);
        }

        [Authorize(Roles = "Admin, Manager")]
        [HttpPost("add-device")]
        public async Task<IActionResult> CreateDevice([FromBody] AddDeviceDTO addDeviceDTO)
        {
            var department = User.FindFirst("department")?.Value;
            if (department == null || department == "Equipment")
            {
                await _deviceService.AddDeviceAsync(addDeviceDTO);
                return Ok(new { message = "Device created successfully" });
            }
            return Forbid();
        }

        [HttpDelete("delete-device/{deviceId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteDevice(Guid deviceId)
        {
            await _deviceService.DeleteDeviceAsync(deviceId);
            return Ok(new { message = "Device deleted successfully" });
        }

        [HttpPost("book-device")]
        public async Task<IActionResult> BookDevice([FromBody] BookDeviceDTO bookDeviceDTO)
        {
            await _deviceService.BookDeviceAsync(bookDeviceDTO);
            return Ok(new { message = "Device booked successfully" });
        }

        [Authorize(Roles = "Admin, Manager")]
        [HttpPost("enable-device/{deviceId}")]
        public async Task<IActionResult> EnableDevice(Guid deviceId)
        {
            var department = User.FindFirst("department")?.Value;
            if (department == null || department == "Equipment")
            {
                await _deviceService.MarkDeviceAsAvailableAsync(deviceId);
                return Ok(new { message = "Device enabled successfully" });
            }
            return Forbid();
        }

        [Authorize(Roles = "Admin, Manager")]
        [HttpPost("disable-device/{deviceId}")]
        public async Task<IActionResult> DisableDevice(Guid deviceId)
        {
            var department = User.FindFirst("department")?.Value;
            if (department == null || department == "Equipment")
            {
                await _deviceService.MarkDeviceAsMaintenanceAsync(deviceId);
                return Ok(new { message = "Device disabled successfully" });
            }
            return Forbid();
        }

        [HttpGet("get-devices-by-room/{roomId}")]
        public async Task<IActionResult> GetDeviceByRoom(Guid roomId)
        {
            var devices = await _deviceService.GetDevicesByRoomIdAsync(roomId);
            if (devices == null || devices.Count == 0)
                return NotFound(new { message = "No devices found in this room" });
            return Ok(devices);
        }

        [HttpGet("get-available-devices")]
        public async Task<IActionResult> GetAvailableDevices([FromQuery] string deviceType, [FromQuery] string roomCode)
        {
            var devices = await _deviceService.GetAvailableDevicesAsync(deviceType, roomCode);
            if (devices == null || devices.Count == 0)
                return NotFound(new { message = "No available devices found" });
            return Ok(devices);
        }

        [HttpGet("get-devices-by-type/{deviceType}")]
        public async Task<IActionResult> GetDevicesByType(string deviceType)
        {
            var devices = await _deviceService.GetDevicesByTypeAsync(deviceType);
            if (devices == null || devices.Count == 0)
                return NotFound(new { message = "No devices found of this type" });
            return Ok(devices);
        }

        [HttpGet("get-devices-by-status/{status}")]
        public async Task<IActionResult> GetDevicesByStatus(string status)
        {
            var devices = await _deviceService.GetDevicesByStatusAsync(status);
            if (devices == null || devices.Count == 0)
                return NotFound(new { message = "No devices found with this status" });
            return Ok(devices);
        }

        [HttpGet("get-devices-by-manufacturer/{manufacturer}")]
        public async Task<IActionResult> GetDevicesByManufacturer(string manufacturer)
        {
            var devices = await _deviceService.GetDevicesByManufacturerAsync(manufacturer);
            if (devices == null || devices.Count == 0)
                return NotFound(new { message = "No devices found from this manufacturer" });
            return Ok(devices);
        }

        [HttpGet("get-devices-by-date-range")]
        public async Task<IActionResult> GetDevicesByDateRange([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            var devices = await _deviceService.GetDevicesByDateRangeAsync(startDate, endDate);
            if (devices == null || devices.Count == 0)
                return NotFound(new { message = "No devices found in this date range" });
            return Ok(devices);
        }

        [HttpGet("get-devices-by-price-range")]
        public async Task<IActionResult> GetDevicesByPriceRange([FromQuery] float minPrice, [FromQuery] float maxPrice)
        {
            var devices = await _deviceService.GetDevicesByPriceRangeAsync(minPrice, maxPrice);
            if (devices == null || devices.Count == 0)
                return NotFound(new { message = "No devices found in this price range" });
            return Ok(devices);
        }

        [HttpGet("get-device-by-name/{name}")]
        public async Task<IActionResult> GetDevicesByName(string name)
        {
            var devices = await _deviceService.GetDevicesByNameAsync(name);
            if (devices == null || devices.Count == 0)
                return NotFound(new { message = "No devices found with this name" });
            return Ok(devices);
        }

        [HttpGet("get-bookings-by-device/{deviceId}")]
        public async Task<IActionResult> GetBookingsByDevice(Guid deviceId)
        {
            var bookings = await _deviceService.GetBookingsByDeviceIdAsync(deviceId);
            if (bookings == null || bookings.Count == 0)
                return NotFound(new { message = "No bookings found for this device" });
            return Ok(bookings);
        }

        [HttpGet("getbooking-by-user/{userId}")]
        public async Task<IActionResult> GetBookingsByUser(Guid userId)
        {
            var bookings = await _deviceService.GetBookingsByUserIdAsync(userId);
            if (bookings == null || bookings.Count == 0)
                return NotFound(new { message = "No bookings found for this user" });
            return Ok(bookings);
        }

        [HttpGet("get-bookings-by-date-range")]
        public async Task<IActionResult> GetBookingsByDateRange([FromQuery] DateOnly startDate, [FromQuery] DateOnly endDate)
        {
            var id = User.FindFirst("userId")?.Value;
            if (!Guid.TryParse(id, out var userId))
                return BadRequest(new { message = "Invalid user identifier" });
            var bookings = await _deviceService.GetBookingsByDateRangeAsync(userId, startDate, endDate);
            if (bookings == null || bookings.Count == 0)
                return NotFound(new { message = "No bookings found in this date range" });
            return Ok(bookings);
        }

        [HttpGet("get-bookings-by-price-range")]
        public async Task<IActionResult> GetBookingsByPriceRange([FromQuery] float minPrice, [FromQuery] float maxPrice)
        {
            var id = User.FindFirst("userId")?.Value;
            if (!Guid.TryParse(id, out var userId))
                return BadRequest(new { message = "Invalid user identifier" });
            var bookings = await _deviceService.GetBookingsByPriceRangeAsync(userId, minPrice, maxPrice);
            if (bookings == null || bookings.Count == 0)
                return NotFound(new { message = "No bookings found in this price range" });
            return Ok(bookings);
        }

        [HttpGet("get-bookings-by-status/{status}")]
        public async Task<IActionResult> GetBookingsByStatus(string status)
        {
            var id = User.FindFirst("userId")?.Value;
            if (!Guid.TryParse(id, out var userId))
                return BadRequest(new { message = "Invalid user identifier" });
            var bookings = await _deviceService.GetBookingsByStatusAsync(userId, status);
            if (bookings == null || bookings.Count == 0)
                return NotFound(new { message = "No bookings found with this status" });
            return Ok(bookings);
        }

        [HttpGet("device-by-room-type/{roomType}")]
        [Authorize(Roles = "Admin, Manager")]
        public async Task<IActionResult> GetAllDeviceTypesByRoomType(RoomTypeCode roomType)
        {
            var department = User.FindFirst("department")?.Value;
            if (department == null || department == "Equipment")
            {
                var deviceTypes = await _deviceService.GetAllDeviceTypesByRoomType(roomType);
                if (deviceTypes == null || deviceTypes.Count == 0)
                    return NotFound(new { message = "No devices found for this room type" });
                return Ok(deviceTypes);
            }
            return Forbid();
        }

        [HttpGet("device-types")]
        [Authorize(Roles = "Admin, Manager")]
        public async Task<IActionResult> GetAllDeviceTypes()
        {
            var department = User.FindFirst("department")?.Value;
            if (department == null || department == "Equipment")
            {
                var deviceTypes = await _deviceService.GetAllDeviceTypesAsync();
                if (deviceTypes == null || deviceTypes.Count == 0)
                    return NotFound(new { message = "No devices found" });
                return Ok(deviceTypes);
            }
            return Forbid();
        }
    }
}