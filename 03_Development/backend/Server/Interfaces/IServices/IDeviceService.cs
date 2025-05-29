using Server.DTOs.Device;
using Server.Enums.Room;
using Server.Models.Booking;
using Server.Models.Device;

namespace Server.Interfaces.IServices
{
    public interface IDeviceService
    {
        public Task AddDeviceAsync(AddDeviceDTO addDeviceDTO);
        public Task<DeviceModel> GetDeviceByIdAsync(Guid deviceId);
        public Task<List<DeviceModel>> GetDevicesAsync();
        public Task<List<DeviceModel>> GetDevicesByRoomIdAsync(Guid roomId);
        public Task MarkDeviceAsMaintenanceAsync(Guid deviceId);
        public Task MarkDeviceAsAvailableAsync(Guid deviceId);
        public Task BookDeviceAsync(BookDeviceDTO bookDeviceDTO);
        public Task<List<string>> GetAllDeviceTypesByRoomType(RoomTypeCode roomType);
        public Task<List<string>> GetAllDeviceTypesAsync();
        public Task<List<DeviceModel>> GetAvailableDevicesAsync(string deviceType, string roomCode);
        public Task<List<DeviceModel>> GetDevicesByTypeAsync(string deviceType);
        public Task<List<DeviceModel>> GetDevicesByStatusAsync(string status);
        public Task<List<DeviceModel>> GetDevicesByManufacturerAsync(string manufacturer);
        public Task<List<DeviceModel>> GetDevicesByDateRangeAsync(DateTime startDate, DateTime endDate);
        public Task<List<DeviceModel>> GetDevicesByPriceRangeAsync(float minPrice, float maxPrice);
        public Task<List<DeviceModel>> GetDevicesByNameAsync(string name);
        public Task<List<BookDeviceModel>> GetBookingsByDeviceIdAsync(Guid deviceId);
        public Task<List<BookDeviceModel>> GetBookingsByUserIdAsync(Guid userId);
        public Task<List<BookDeviceModel>> GetBookingsByDateRangeAsync(Guid userId, DateOnly startDate, DateOnly endDate);
        public Task<List<BookDeviceModel>> GetBookingsByPriceRangeAsync(Guid userId, float minPrice, float maxPrice);
        public Task<List<BookDeviceModel>> GetBookingsByStatusAsync(Guid userId, string status);
        public Task DeleteDeviceAsync(Guid deviceId);
        public Task UpdateDeviceAsync(Guid deviceId, UpdateDeviceDTO updateDeviceDTO);
    }
}