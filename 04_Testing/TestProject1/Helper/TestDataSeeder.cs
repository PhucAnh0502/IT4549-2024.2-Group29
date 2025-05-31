using Server.Interfaces.IServices;
using Server.Models.Account;
using Server.Models.Course;
using Server.Models.Device;
using Server.Models.Room;
using Server.Models.User;

namespace TestProject1.Helper;

public class TestDataSeeder
{
    private readonly IBcryptService _bcryptService;

    public TestDataSeeder(IBcryptService bcryptService)
    {
        _bcryptService = bcryptService;
    }
    public static UserBaseModel SeedUser()
    {
        var mockUser = new UserBaseModel
        {
            Id = Guid.NewGuid(),
            FirstName = "Alice",
            LastName = "Smith",
            DateOfBirth = new DateTime(1990, 5, 15),
            CurrentBalance = 1000.50f,
            AccountId = Guid.NewGuid(),
            Account = new AccountModel
            {
                Id = Guid.NewGuid(),
                Email = "alice.smith@example.com",
                Password = "123456",
                Role = "Member",
                IsActivated = true
                // Gán các property required khác của AccountModel nếu có
            }
        };
        
        return mockUser;
    }
    public static DeviceModel SeedDevice()
    {
        var room = new RoomModel
        {
            Id = Guid.NewGuid(),
            Name = "Test Room",
            RoomCode = "R101",
            RoomType = "Lecture",
            Capacity = 30,
            Status = "Available",
            Devices = new List<DeviceModel>()
        };
        
        var device1 = new DeviceModel
        {
            Id = Guid.NewGuid(),
            DeviceCode = "DEV001",
            Name = "Projector X100",
            DeviceType = "Projector",
            Manufacturer = "Epson",
            DateOfPurchase = new DateTime(2021, 5, 1),
            WarrantyPeriod = 24,
            RentalFee = 100f,
            LastMaintenance = new DateTime(2023, 1, 15),
            Status = "Working",
            RoomId = room.Id,
            Room = room
        };
        return device1;
    }
    public static CourseModel SeedCourse()
    {
        var room = new RoomModel
        {
            Id = Guid.NewGuid(),
            Name = "Test Room",
            RoomCode = "R101",
            RoomType = "Lecture",
            Capacity = 30,
            Status = "Available",
            Devices = new List<DeviceModel>()
        };
        var device1 = new DeviceModel
        {
            Id = Guid.NewGuid(),
            DeviceCode = "DEV001",
            Name = "Projector X100",
            DeviceType = "Projector",
            Manufacturer = "Epson",
            DateOfPurchase = new DateTime(2021, 5, 1),
            WarrantyPeriod = 24,
            RentalFee = 100f,
            LastMaintenance = new DateTime(2023, 1, 15),
            Status = "Working",
            RoomId = room.Id,
            Room = room
        };

        var device2 = new DeviceModel
        {
            Id = Guid.NewGuid(),
            DeviceCode = "DEV002",
            Name = "Air Conditioner 3000",
            DeviceType = "AC",
            Manufacturer = "Daikin",
            DateOfPurchase = new DateTime(2020, 3, 10),
            WarrantyPeriod = 36,
            RentalFee = 50f,
            LastMaintenance = new DateTime(2023, 2, 20),
            Status = "Working",
            RoomId = room.Id,
            Room = room
        };
        room.Devices.Add(device1);
        room.Devices.Add(device2);
        var trainer = new TrainerModel
        {
            Id = Guid.NewGuid(),
            Specialization = "Software Development",
            FirstName = "John",
            LastName = "Doe",
            DateOfBirth = new DateTime(1980, 1, 1)
        };

        var course = new CourseModel
        {
            Id = Guid.NewGuid(),
            Name = "Test Course",
            Description = "Sample Description",
            StartDate = DateTime.Today,
            EndDate = DateTime.Today.AddDays(5),
            StartTime = TimeSpan.FromHours(9),
            EndTime = TimeSpan.FromHours(17),
            Type = "Online",
            Status = "Active",
            Price = 100,
            RoomId = room.Id,
            Room = room,
            TrainerId = trainer.Id,
            Trainer = trainer
        };

        return course;
    }
}