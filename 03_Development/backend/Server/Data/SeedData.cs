using Microsoft.EntityFrameworkCore;
using Server.Enums.Course;
using Server.Enums.Device;
using Server.Enums.Room;
using Server.Models.Account;
using Server.Models.Course;
using Server.Models.Device;
using Server.Models.Room;
using Server.Models.User;
using Server.Services;

namespace Server.Data
{
    public class SeedData(DatabaseContext context)
    {
        private readonly DatabaseContext _context = context;
        private static readonly BcryptService _bcryptService = new();

        public static (List<AccountModel> Accounts, List<UserBaseModel> Users) GetAccountAndUserSeedData()
        {
            var accounts = new List<AccountModel>();
            var users = new List<UserBaseModel>();

            // Cấu hình số lượng người dùng cho từng vai trò
            var predefinedRoles = new List<(string Role, int Count)>
    {
        ("Admin", 1),
        ("Manager", 5), // 5 managers
        ("Trainer", 14),
        ("Member", 30)  // Các thành viên còn lại
    };

            // Mảng danh sách departments để phân công cho các manager
            var departments = new List<string>
    {
        "HR", "Finance", "Marketing", "Sales", "Support"
    };

            int userIndex = 1;

            foreach (var (role, count) in predefinedRoles)
            {
                for (int i = 0; i < count; i++, userIndex++)
                {
                    var accountId = Guid.NewGuid();
                    var userId = Guid.NewGuid();

                    var account = new AccountModel
                    {
                        Id = accountId,
                        Email = $"{role.ToLower()}{i + 1}@gymcenter.com",
                        Password = _bcryptService.HashPassword("123456"),
                        Role = role,
                        IsActivated = role == "Admin" || role == "Manager" || userIndex % 5 != 0,
                        UserId = userId
                    };

                    accounts.Add(account);

                    // Phân công người dùng dựa trên role
                    UserBaseModel user = role switch
                    {
                        "Admin" => new AdminModel
                        {
                            Id = userId,
                            FirstName = GetRandomFirstName(),
                            LastName = GetRandomLastName(),
                            DateOfBirth = GenerateRandomDateOfBirth(),
                            CurrentBalance = 0,
                            AccountId = accountId
                        },
                        "Manager" => new ManagerModel
                        {
                            Id = userId,
                            FirstName = GetRandomFirstName(),
                            LastName = GetRandomLastName(),
                            DateOfBirth = GenerateRandomDateOfBirth(),
                            CurrentBalance = 0,
                            AccountId = accountId,
                            Department = departments[i]  // Gán department cho manager
                        },
                        "Trainer" => new TrainerModel
                        {
                            Id = userId,
                            FirstName = GetRandomFirstName(),
                            LastName = GetRandomLastName(),
                            DateOfBirth = GenerateRandomDateOfBirth(),
                            CurrentBalance = 0,
                            AccountId = accountId,
                            Specialization = GetRandomSpecialization()
                        },
                        _ => new MemberModel
                        {
                            Id = userId,
                            FirstName = GetRandomFirstName(),
                            LastName = GetRandomLastName(),
                            DateOfBirth = GenerateRandomDateOfBirth(),
                            CurrentBalance = 1000000,
                            AccountId = accountId
                        },
                    };

                    users.Add(user);
                }
            }

            return (accounts, users);
        }

        public static List<RoomModel> GetRoomSeedData()
        {
            var rooms = new List<RoomModel>();
            var predefinedRooms = new List<(string RoomName, RoomTypeCode RoomType, int RoomNumber)>
            {
                ("Cardio Zone", RoomTypeCode.Cardio, 101),
                ("Strength Training Hall", RoomTypeCode.Strength, 102),
                ("CrossFit Arena", RoomTypeCode.CrossFit, 103),
                ("Yoga Studio", RoomTypeCode.Yoga, 104),
                ("Pilates Room", RoomTypeCode.Pilates, 105),
                ("Boxing Ring", RoomTypeCode.Boxing, 106),
                ("Spinning Class", RoomTypeCode.Spinning, 107),
                ("Functional Training Area", RoomTypeCode.Functional, 108),
                ("Dance Studio", RoomTypeCode.Dance, 109),
                ("Personal Training Room", RoomTypeCode.PersonalTraining, 110),
                ("Recovery Zone", RoomTypeCode.Recovery, 111),
                ("Multipurpose Hall", RoomTypeCode.Multipurpose, 112)
            };

            foreach (var (roomName, roomType, roomNumber) in predefinedRooms)
            {
                string roomTypePrefix = roomType.ToString()[..2].ToUpper();
                string roomCode = $"{roomTypePrefix}-{roomNumber}";

                var room = new RoomModel
                {
                    Id = Guid.NewGuid(),
                    Name = roomName,
                    RoomType = roomType.ToString(),
                    RoomCode = roomCode,
                    Capacity = Convert.ToInt32(RoomMaxCapacity.MaxCapacity),
                    Status = RoomStatusCode.Available.ToString(),
                    Devices = []
                };

                rooms.Add(room);
            }

            return rooms;
        }

        public static async Task<List<DeviceModel>> GetDeviceSeedData(DatabaseContext context)
        {
            var devices = new List<DeviceModel>();
            var rooms = await context.Rooms.ToListAsync();
            var deviceTypes = Enum.GetValues(typeof(DeviceTypeCode)).Cast<DeviceTypeCode>().ToList();

            Random random = new();
            foreach (var room in rooms)
            {
                for (int i = 0; i < 10; i++)
                {
                    var deviceType = deviceTypes[random.Next(deviceTypes.Count)];
                    int deviceTypePrefix = (int)deviceType / 10;
                    int roomTypePrefix = ((int)Enum.Parse<RoomTypeCode>(room.RoomType)) / 10;

                    if (deviceTypePrefix != roomTypePrefix)
                    {
                        continue;
                    }

                    var manufacturer = GetRandomManufacturer();
                    devices.Add(new DeviceModel
                    {
                        Id = Guid.NewGuid(),
                        Name = deviceType.ToString() + " Machine",
                        DeviceType = deviceType.ToString(),
                        Status = "Available",
                        RoomId = room.Id,
                        DeviceCode = $"{deviceType.ToString().Substring(0, 3).ToUpper()}-{Guid.NewGuid().ToString()[..8]}",
                        Manufacturer = manufacturer + " Manufacturer",
                        DateOfPurchase = DateTime.Now.AddYears(-1),
                        WarrantyPeriod = (int)TimeSpan.FromDays(30 * 2).TotalDays, // 2 months warranty
                        LastMaintenance = DateTime.Now.AddMonths(-3),
                        RentalFee = random.Next(10000, 50000),
                    });
                }
            }
            return devices;
        }

        public static async Task<List<CourseModel>> GetCourseSeedData(DatabaseContext context)
        {
            var trainers = await context.Trainers.ToListAsync();
            var rooms = await context.Rooms.ToListAsync();
            var courseTypes = Enum.GetValues(typeof(CourseTypeCode)).Cast<CourseTypeCode>().ToList();

            var rnd = new Random();
            var courses = new List<CourseModel>();

            var trainingDayOptions = new List<List<DayOfWeek>>
                {
                    new() { DayOfWeek.Monday, DayOfWeek.Wednesday, DayOfWeek.Friday },
                    new() { DayOfWeek.Tuesday, DayOfWeek.Thursday },
                    new() { DayOfWeek.Saturday, DayOfWeek.Sunday },
                    new() { DayOfWeek.Monday, DayOfWeek.Thursday }
                };

            for (int i = 1; i <= 30; i++)
            {
                var type = courseTypes[rnd.Next(courseTypes.Count)];
                var trainer = trainers.FirstOrDefault(t => t.Specialization == type.ToString());
                if (trainer == null) continue;

                var matchingRooms = rooms.Where(r => r.RoomType == type.ToString()).ToList();
                if (matchingRooms.Count == 0) continue;

                var room = matchingRooms[rnd.Next(matchingRooms.Count)];
                var startDate = DateTime.UtcNow.AddDays(rnd.Next(1, 20));
                var endDate = startDate.AddDays(rnd.Next(15, 40));
                var startTime = TimeSpan.FromHours(rnd.Next(6, 18));
                var endTime = startTime.Add(TimeSpan.FromHours(1));
                var price = rnd.Next(200, 1000);
                var trainingDays = trainingDayOptions[rnd.Next(trainingDayOptions.Count)];

                var course = new CourseModel
                {
                    Id = Guid.NewGuid(),
                    Name = $"Course {i} - {type}",
                    Description = $"Auto-generated course for {type}",
                    StartDate = startDate,
                    EndDate = endDate,
                    StartTime = startTime,
                    EndTime = endTime,
                    Type = type.ToString(),
                    Status = CourseStatusCode.Upcoming.ToString(),
                    Price = price,
                    RoomId = room.Id,
                    Room = room,
                    TrainerId = trainer.Id,
                    Trainer = trainer,
                    TrainingDays = trainingDays
                };

                courses.Add(course);
            }

            return courses;
        }

        private static string GetRandomManufacturer()
        {
            string[] manufacturers = {
                "Technogym", "Life Fitness", "Precor", "Matrix", "Cybex",
                "Star Trac", "Nautilus", "Hammer Strength", "Keiser", "Octane"
            };
            return manufacturers[new Random().Next(manufacturers.Length)];
        }

        private static string GetRandomFirstName()
        {
            string[] firstNames = {
                "Minh", "Anh", "Hùng", "Lan", "Hoa",
                "Tuấn", "Linh", "Đức", "Mai", "Trang",
                "Quân", "Nga", "Khoa", "Hương", "Trung"
            };
            return firstNames[new Random().Next(firstNames.Length)];
        }

        private static string GetRandomLastName()
        {
            string[] lastNames = {
                "Nguyễn", "Trần", "Lê", "Phạm", "Hoàng",
                "Huỳnh", "Phan", "Võ", "Đặng", "Bùi"
            };
            return lastNames[new Random().Next(lastNames.Length)];
        }

        private static string GetRandomSpecialization()
        {
            string[] specializations = {
                "Cardio",
                "Strength",
                "CrossFit",
                "Yoga",
                "Pilates",
                "Boxing",
                "Spinning",
                "Functional",
                "Dance",
                "PersonalTraining",
                "Recovery",
                "Multipurpose"
            };
            return specializations[new Random().Next(specializations.Length)];
        }

        private static string GetRandomDepartment()
        {
            string[] departments = {
                "HR",
                "Finance",
                "Equipment",
                "Support",
            };
            return departments[new Random().Next(departments.Length)];
        }

        private static DateTime GenerateRandomDateOfBirth()
        {
            Random random = new Random();
            DateTime start = new DateTime(1970, 1, 1);
            int range = (DateTime.Today.AddYears(-18) - start).Days;
            return start.AddDays(random.Next(range));
        }
    }
}