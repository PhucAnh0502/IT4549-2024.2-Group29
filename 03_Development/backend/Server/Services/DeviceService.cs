using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.DTOs.Device;
using Server.Enums.ErrorCodes;
using Server.Enums.Device;
using Server.Interfaces.IServices;
using Server.Middlewares;
using Server.Models.Device;
using Server.Enums.Room;
using Server.Helpers;
using Server.Models.Booking;
using Server.Enums.Booking;
using Server.Models.User;

namespace Server.Services
{
    public class DeviceService(DatabaseContext context) : IDeviceService
    {
        private readonly DatabaseContext _context = context;

        public async Task AddDeviceAsync(AddDeviceDTO addDeviceDTO)
        {
            var room = await _context.Rooms.FirstOrDefaultAsync(r => r.RoomCode == addDeviceDTO.RoomCode) ??
                       throw new RoomException(RoomErrorCode.RoomNotFound, "Room not found.");
            int deviceTypeValue;
            if (!Enum.TryParse<DeviceTypeCode>(addDeviceDTO.DeviceType, out var deviceTypeCode))
            {
                throw new DeviceException(DeviceErrorCode.InvalidDeviceType, "Invalid device type.");
            }
            deviceTypeValue = (int)deviceTypeCode;
            int deviceTypePrefix = deviceTypeValue / 10;
            int roomTypePrefix = ((int)Enum.Parse<RoomTypeCode>(room.RoomType)) / 10;
            if (deviceTypePrefix != roomTypePrefix)
            {
                throw new DeviceException(DeviceErrorCode.DeviceNotFitRoomType, "Device not match room's purpose.");
            }

            var deviceCode = DeviceCodeHelper.GenerateDeviceCode(addDeviceDTO.DeviceType, addDeviceDTO.Manufacturer);

            var device = new DeviceModel
            {
                Id = Guid.NewGuid(),
                Name = addDeviceDTO.Name,
                DeviceType = addDeviceDTO.DeviceType,
                Manufacturer = addDeviceDTO.Manufacturer,
                DateOfPurchase = addDeviceDTO.DateOfPurchase,
                WarrantyPeriod = addDeviceDTO.WarrantyPeriod,
                DeviceCode = deviceCode,
                RentalFee = addDeviceDTO.RentalFee,
                LastMaintenance = DateTime.UtcNow,
                Status = DeviceStatusCode.Available.ToString(),
                RoomId = room.Id,
                Room = room
            };

            _context.Devices.Add(device);
            await _context.SaveChangesAsync();
        }

        public async Task<DeviceModel> GetDeviceByIdAsync(Guid deviceId)
        {
            var device = await _context.Devices.FirstOrDefaultAsync(d => d.Id == deviceId) ??
                         throw new DeviceException(DeviceErrorCode.DeviceNotFound, "Device not found.");
            return device;
        }

        public async Task<List<DeviceModel>> GetDevicesAsync()
        {
            var devices = await _context.Devices.ToListAsync();
            return devices;
        }

        public async Task DeleteDeviceAsync(Guid deviceId)
        {
            var device = await _context.Devices.FirstOrDefaultAsync(d => d.Id == deviceId) ??
                         throw new DeviceException(DeviceErrorCode.DeviceNotFound, "Device not found.");
            _context.Devices.Remove(device);
            await _context.SaveChangesAsync();
        }

        public async Task MarkDeviceAsAvailableAsync(Guid deviceId)
        {
            var device = await _context.Devices.FirstOrDefaultAsync(d => d.Id == deviceId) ??
                         throw new DeviceException(DeviceErrorCode.DeviceNotFound, "Device not found.");
            device.Status = DeviceStatusCode.Available.ToString();
            device.LastMaintenance = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }

        public async Task MarkDeviceAsMaintenanceAsync(Guid deviceId)
        {
            var device = await _context.Devices.FirstOrDefaultAsync(d => d.Id == deviceId) ??
                         throw new DeviceException(DeviceErrorCode.DeviceNotFound, "Device not found.");
            device.Status = DeviceStatusCode.UnderMaintenance.ToString();
            await _context.SaveChangesAsync();
        }

        public async Task BookDeviceAsync(BookDeviceDTO bookDeviceDTO)
        {
            // Kiểm tra thiết bị
            var device = await _context.Devices.FirstOrDefaultAsync(d => d.Id == bookDeviceDTO.DeviceId) ??
                         throw new DeviceException(DeviceErrorCode.DeviceNotFound, "Device not found.");
            if (device.Status != DeviceStatusCode.Available.ToString())
            {
                throw new DeviceException(DeviceErrorCode.DeviceNotAvailable, "Device is not available.");
            }
            UserBaseModel? user = null;

            // Lấy account để xác định role
            var account = await _context.Accounts.FirstOrDefaultAsync(a => a.UserId == bookDeviceDTO.UserId) ?? throw new UserException(UserErrorCode.UserNotFound, "User account not found.");

            // Tìm user dựa vào role
            user = account.Role switch
            {
                "Admin" => await _context.Admins.FirstOrDefaultAsync(a => a.Id == bookDeviceDTO.UserId),
                "Manager" => await _context.Managers.FirstOrDefaultAsync(a => a.Id == bookDeviceDTO.UserId),
                "Trainer" => await _context.Trainers.FirstOrDefaultAsync(a => a.Id == bookDeviceDTO.UserId),
                "Member" => await _context.Members.FirstOrDefaultAsync(a => a.Id == bookDeviceDTO.UserId),
                _ => null
            };

            if (user == null)
            {
                throw new UserException(UserErrorCode.UserNotFound, "User not found.");
            }

            var userBookings = await _context.Bookings
                .Where(b => b.UserId == bookDeviceDTO.UserId)
                .ToListAsync();
            var lastUserBooking = userBookings.LastOrDefault();
            // Lấy các booking hiện tại của thiết bị
            var bookings = await _context.Bookings.Where(b => b.DeviceId == bookDeviceDTO.DeviceId).ToListAsync();
            var lastBooking = bookings.LastOrDefault();
            var bookingStatus = "Pending";

            bookingStatus = (lastBooking?.Status) switch
            {
                null => BookingStatusCode.Ready.ToString(),
                var status when status == BookingStatusCode.Ready.ToString() => BookingStatusCode.Pending.ToString(),
                var status when status == BookingStatusCode.Pending.ToString() => BookingStatusCode.Pending.ToString(),
                var status when status == BookingStatusCode.Done.ToString() => BookingStatusCode.Ready.ToString(),
                _ => BookingStatusCode.Pending.ToString(),
            };

            if (bookDeviceDTO.BookingDate < DateOnly.FromDateTime(DateTime.UtcNow))
            {
                throw new DeviceException(DeviceErrorCode.InvalidBookingDate, "Invalid booking date.");
            }
            if (bookDeviceDTO.From >= bookDeviceDTO.To)
            {
                throw new DeviceException(DeviceErrorCode.InvalidBookingTime, "Invalid booking time.");
            }

            if (bookDeviceDTO.From < lastBooking?.To)
            {
                throw new DeviceException(DeviceErrorCode.InvalidBookingTime, "Device is already booked this time.");
            }

            if (bookDeviceDTO.From < lastUserBooking?.To)
            {
                throw new DeviceException(DeviceErrorCode.InvalidBookingTime, "User has a booking this time.");
            }
            // Tính số giờ mượn
            double hours = (bookDeviceDTO.To - bookDeviceDTO.From).TotalHours;

            // Tính phí thuê
            float fee = (float)(hours * device.RentalFee);

            var booking = new BookDeviceModel
            {
                Id = Guid.NewGuid(),
                DeviceId = bookDeviceDTO.DeviceId,
                UserId = bookDeviceDTO.UserId,
                BookingDate = bookDeviceDTO.BookingDate,
                Fee = fee,
                From = bookDeviceDTO.From,
                To = bookDeviceDTO.To,
                Status = bookingStatus,
                Device = device,
                User = user,
                CreatedAt = DateTime.UtcNow
            };
            user.CurrentBalance -= fee;
            if (user.CurrentBalance < 0)
            {
                throw new UserException(UserErrorCode.InsufficientBalance, "Insufficient balance.");
            }
            // Lưu thay đổi
            _context.Bookings.Add(booking);
            _context.Users.Update(user);

            await _context.SaveChangesAsync();
        }

        public async Task<List<DeviceModel>> GetDevicesByRoomIdAsync(Guid roomId)
        {
            var devices = await _context.Devices.Where(d => d.RoomId == roomId).ToListAsync();
            if (devices == null || devices.Count == 0)
            {
                throw new DeviceException(DeviceErrorCode.DeviceNotFound, "No devices found in this room.");
            }
            return devices;
        }

        public async Task<List<DeviceModel>> GetAvailableDevicesAsync(string deviceType, string roomCode)
        {
            var room = await _context.Rooms.FirstOrDefaultAsync(r => r.RoomCode == roomCode) ??
                       throw new RoomException(RoomErrorCode.RoomNotFound, "Room not found.");
            var devices = await _context.Devices
                .Where(d => d.DeviceType == deviceType && d.RoomId == room.Id && d.Status == DeviceStatusCode.Available.ToString())
                .ToListAsync();
            if (devices == null || devices.Count == 0)
            {
                throw new DeviceException(DeviceErrorCode.DeviceNotFound, "No available devices found.");
            }
            return devices;
        }

        public async Task<List<DeviceModel>> GetDevicesByTypeAsync(string deviceType)
        {
            var devices = await _context.Devices
                .Where(d => d.DeviceType == deviceType)
                .ToListAsync();
            if (devices == null || devices.Count == 0)
            {
                throw new DeviceException(DeviceErrorCode.DeviceNotFound, "No devices found of this type.");
            }
            return devices;
        }

        public async Task<List<DeviceModel>> GetDevicesByStatusAsync(string status)
        {
            var devices = await _context.Devices
                .Where(d => d.Status == status)
                .ToListAsync();
            if (devices == null || devices.Count == 0)
            {
                throw new DeviceException(DeviceErrorCode.DeviceNotFound, "No devices found with this status.");
            }
            return devices;
        }

        public async Task<List<DeviceModel>> GetDevicesByManufacturerAsync(string manufacturer)
        {
            var devices = await _context.Devices
                .Where(d => d.Manufacturer == manufacturer)
                .ToListAsync();
            if (devices == null || devices.Count == 0)
            {
                throw new DeviceException(DeviceErrorCode.DeviceNotFound, "No devices found from this manufacturer.");
            }
            return devices;
        }

        public async Task<List<DeviceModel>> GetDevicesByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            var devices = await _context.Devices
                .Where(d => d.DateOfPurchase >= startDate && d.DateOfPurchase <= endDate)
                .ToListAsync();
            if (devices == null || devices.Count == 0)
            {
                throw new DeviceException(DeviceErrorCode.DeviceNotFound, "No devices found in this date range.");
            }
            return devices;
        }

        public async Task<List<DeviceModel>> GetDevicesByPriceRangeAsync(float minPrice, float maxPrice)
        {
            var devices = await _context.Devices
                .Where(d => d.RentalFee >= minPrice && d.RentalFee <= maxPrice)
                .ToListAsync();
            if (devices == null || devices.Count == 0)
            {
                throw new DeviceException(DeviceErrorCode.DeviceNotFound, "No devices found in this price range.");
            }
            return devices;
        }

        public async Task<List<DeviceModel>> GetDevicesByNameAsync(string name)
        {
            var devices = await _context.Devices
                .Where(d => d.Name.Contains(name))
                .ToListAsync();
            if (devices == null || devices.Count == 0)
            {
                throw new DeviceException(DeviceErrorCode.DeviceNotFound, "No devices found with this name.");
            }
            return devices;
        }

        public async Task<List<BookDeviceModel>> GetBookingsByDeviceIdAsync(Guid deviceId)
        {
            var bookings = await _context.Bookings
                .Where(b => b.DeviceId == deviceId)
                .ToListAsync();
            if (bookings == null || bookings.Count == 0)
            {
                throw new DeviceException(DeviceErrorCode.DeviceNotFound, "No bookings found for this device.");
            }
            return bookings;
        }

        public async Task<List<BookDeviceModel>> GetBookingsByUserIdAsync(Guid userId)
        {
            var bookings = await _context.Bookings
                .Where(b => b.UserId == userId)
                .ToListAsync();
            if (bookings == null || bookings.Count == 0)
            {
                throw new UserException(UserErrorCode.UserNotFound, "No bookings found for this user.");
            }
            return bookings;
        }

        public async Task<List<BookDeviceModel>> GetBookingsByDateRangeAsync(Guid userId, DateOnly startDate, DateOnly endDate)
        {
            var bookings = await _context.Bookings
                .Where(b => b.UserId == userId && b.BookingDate >= startDate && b.BookingDate <= endDate)
                .ToListAsync();
            if (bookings == null || bookings.Count == 0)
            {
                throw new UserException(UserErrorCode.UserNotFound, "No bookings found for this user in this date range.");
            }
            return bookings;
        }

        public async Task<List<BookDeviceModel>> GetBookingsByPriceRangeAsync(Guid userId, float minPrice, float maxPrice)
        {
            var bookings = await _context.Bookings
                .Where(b => b.UserId == userId && b.Fee >= minPrice && b.Fee <= maxPrice)
                .ToListAsync();
            if (bookings == null || bookings.Count == 0)
            {
                throw new UserException(UserErrorCode.UserNotFound, "No bookings found for this user in this price range.");
            }
            return bookings;
        }

        public async Task<List<BookDeviceModel>> GetBookingsByStatusAsync(Guid userId, string status)
        {
            var bookings = await _context.Bookings
                .Where(b => b.UserId == userId && b.Status == status)
                .ToListAsync();
            if (bookings == null || bookings.Count == 0)
            {
                throw new UserException(UserErrorCode.UserNotFound, "No bookings found for this user with this status.");
            }
            return bookings;
        }

        public Task UpdateDeviceAsync(Guid deviceId, UpdateDeviceDTO updateDeviceDTO)
        {
            throw new NotImplementedException();
        }

        public Task<List<string>> GetAllDeviceTypesByRoomType(RoomTypeCode roomType)
        {
            RoomTypeCode roomTypeCode = roomType;
            int roomTypeCodeValue = (int)roomTypeCode;
            int baseRoomCode = roomTypeCodeValue;
            var deviceTypes = Enum.GetValues(typeof(DeviceTypeCode))
                                 .Cast<DeviceTypeCode>()
                                 .Where(d => (int)d / 10 == baseRoomCode / 10)
                                 .Select(d => d.ToString())
                                 .ToList();

            return Task.FromResult(deviceTypes);
        }

        public Task<List<string>> GetAllDeviceTypesAsync()
        {
            var deviceTypes = Enum.GetValues(typeof(DeviceTypeCode))
                                 .Cast<DeviceTypeCode>()
                                 .Select(d => d.ToString())
                                 .ToList();

            return Task.FromResult(deviceTypes);
        }
    }
}