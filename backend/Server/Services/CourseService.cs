using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.DTOs.Course;
using Server.Enums.Course;
using Server.Enums.ErrorCodes;
using Server.Interfaces.IServices;
using Server.Middlewares;
using Server.Models.Course;
using Server.Models.User;

namespace Server.Services
{
    public class CourseService(DatabaseContext context) : ICourseService
    {
        private readonly DatabaseContext _context = context;

        public async Task CreateCourseAsync(CreateCourseDTO createCourseDTO, Guid trainerId)
        {
            var room = await _context.Rooms
                .FirstOrDefaultAsync(r => r.Name == createCourseDTO.RoomName) ?? throw new CourseException(
                    CourseErrorCode.RoomNotFound,
                    $"Room with name {createCourseDTO.RoomName} not found.");
            var trainer = await _context.Trainers
                .FirstOrDefaultAsync(t => t.Id == trainerId) ?? throw new CourseException(
                    CourseErrorCode.TrainerNotFound,
                    $"Trainer with ID {trainerId} not found.");
            if (trainer.Specialization != createCourseDTO.Type.ToString())
                throw new CourseException(
                    CourseErrorCode.InvalidTrainerSpecialization,
                    "Trainer's specialization does not match course type.");
            if (createCourseDTO.StartDate < DateTime.UtcNow)
                throw new CourseException(
                    CourseErrorCode.InvalidStartDate,
                    "Start date cannot be in the past.");
            if (createCourseDTO.EndDate < createCourseDTO.StartDate)
                throw new CourseException(
                    CourseErrorCode.InvalidEndDate,
                    "End date cannot be before start date.");
            if (createCourseDTO.Price < 0)
                throw new CourseException(
                    CourseErrorCode.InvalidPrice,
                    "Price cannot be negative.");
            if (createCourseDTO.StartTime >= createCourseDTO.EndTime)
                throw new CourseException(
                    CourseErrorCode.InvalidTime,
                    "Start time cannot be greater than or equal to end time.");
            var course = new CourseModel
            {
                Id = Guid.NewGuid(),
                Name = createCourseDTO.Name,
                Description = createCourseDTO.Description,
                StartDate = createCourseDTO.StartDate,
                EndDate = createCourseDTO.EndDate,
                StartTime = createCourseDTO.StartTime,
                EndTime = createCourseDTO.EndTime,
                Type = createCourseDTO.Type.ToString(),
                Status = CourseStatusCode.Upcoming.ToString(),
                Price = createCourseDTO.Price,
                RoomId = room.Id,
                Room = room,
                TrainerId = trainerId,
                Trainer = trainer,
                TrainingDays = createCourseDTO.TrainingDays
            };

            await _context.Courses.AddAsync(course);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteCourseAsync(Guid courseId)
        {
            var course = await _context.Courses
                .FirstOrDefaultAsync(c => c.Id == courseId) ?? throw new CourseException(
                    CourseErrorCode.CourseNotFound,
                    $"Course with ID {courseId} not found.");
            if (course.Status != CourseStatusCode.Upcoming.ToString())
                throw new CourseException(
                    CourseErrorCode.InvalidCourseStatus,
                    "Cannot delete a course that is not upcoming.");
            var registeredCourse = await _context.RegisteredCourses
                .FirstOrDefaultAsync(rc => rc.CourseId == courseId);
            if (registeredCourse != null)
            {
                _context.RegisteredCourses.Remove(registeredCourse);
            }
            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();
        }

        public async Task<CourseModel> GetCourseByIdAsync(Guid courseId)
        {
            var course = await _context.Courses
                .Include(c => c.Room)
                .Include(c => c.Trainer)
                .FirstOrDefaultAsync(c => c.Id == courseId) ?? throw new CourseException(
                    CourseErrorCode.CourseNotFound,
                    $"Course with ID {courseId} not found.");
            return course;
        }

        public async Task<List<CourseModel>> GetCoursesAsync()
        {
            var courses = await _context.Courses
                .Include(c => c.Room)
                .Include(c => c.Trainer)
                .ToListAsync();
            return courses;
        }

        public async Task<List<CourseModel>> GetCoursesByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            var courses = await _context.Courses
                .Include(c => c.Room)
                .Include(c => c.Trainer)
                .Where(c => c.StartDate >= startDate && c.EndDate <= endDate)
                .ToListAsync() ?? throw new CourseException(
                    CourseErrorCode.CourseNotFound,
                    $"No courses found in the specified date range.");
            return courses;
        }

        public Task<List<CourseModel>> GetCoursesByMemberIdAsync(Guid memberId)
        {
            var courses = _context.RegisteredCourses
                .Include(rc => rc.Course)
                .ThenInclude(c => c.Room)
                .Include(rc => rc.Course)
                .ThenInclude(c => c.Trainer)
                .Where(rc => rc.MemberId == memberId)
                .Select(rc => rc.Course)
                .ToListAsync() ?? throw new CourseException(
                    CourseErrorCode.RegisteredCourseNotFound,
                    $"No registered courses found for member with ID {memberId}.");
            return courses;
        }

        public async Task<List<CourseModel>> GetCoursesByNameAsync(string name)
        {
            var courses = await _context.Courses
                .Include(c => c.Room)
                .Include(c => c.Trainer)
                .Where(c => c.Name.Contains(name))
                .ToListAsync() ?? throw new CourseException(
                    CourseErrorCode.CourseNotFound,
                    $"No courses found with the name {name}.");
            return courses;
        }

        public async Task<List<CourseModel>> GetCoursesByPriceRangeAsync(float minPrice, float maxPrice)
        {
            var courses = await _context.Courses
                .Include(c => c.Room)
                .Include(c => c.Trainer)
                .Where(c => c.Price >= minPrice && c.Price <= maxPrice)
                .ToListAsync() ?? throw new CourseException(
                    CourseErrorCode.CourseNotFound,
                    $"No courses found in the specified price range.");
            return courses;
        }

        public async Task<List<CourseModel>> GetCoursesByRoomIdAsync(Guid roomId)
        {
            var courses = await _context.Courses
                .Include(c => c.Room)
                .Include(c => c.Trainer)
                .Where(c => c.RoomId == roomId)
                .ToListAsync() ?? throw new CourseException(
                    CourseErrorCode.CourseNotFound,
                    $"No courses found in the room with ID {roomId}.");
            return courses;
        }

        public async Task<List<CourseModel>> GetCoursesByStatusAsync(string status)
        {
            var courses = await _context.Courses
                .Include(c => c.Room)
                .Include(c => c.Trainer)
                .Where(c => c.Status == status)
                .ToListAsync() ?? throw new CourseException(
                    CourseErrorCode.CourseNotFound,
                    $"No courses found with the status {status}.");
            return courses;
        }

        public async Task<List<CourseModel>> GetCoursesByTrainerIdAsync(Guid trainerId)
        {
            var courses = await _context.Courses
                .Include(c => c.Room)
                .Include(c => c.Trainer)
                .Where(c => c.TrainerId == trainerId)
                .ToListAsync() ?? throw new CourseException(
                    CourseErrorCode.CourseNotFound,
                    $"No courses found for trainer with ID {trainerId}.");
            return courses;
        }

        public async Task<List<CourseModel>> GetCoursesByTypeAsync(string type)
        {
            var courses = await _context.Courses
                .Include(c => c.Room)
                .Include(c => c.Trainer)
                .Where(c => c.Type == type)
                .ToListAsync() ?? throw new CourseException(
                    CourseErrorCode.CourseNotFound,
                    $"No courses found with the type {type}.");
            return courses;
        }

        public async Task<string> GetCourseTypeByIdAsync(Guid courseId)
        {
            var courseType = await _context.Courses
                .Where(c => c.Id == courseId)
                .Select(c => c.Type)
                .FirstOrDefaultAsync() ?? throw new CourseException(
                    CourseErrorCode.CourseNotFound,
                    $"Course with ID {courseId} not found.");
            return courseType;
        }

        public async Task<UserBaseModel> GetMemberByRegisteredCourseIdAsync(Guid registeredCourseId)
        {
            var registeredCourse = await _context.RegisteredCourses
                .Include(rc => rc.Member)
                .FirstOrDefaultAsync(rc => rc.Id == registeredCourseId) ?? throw new CourseException(
                    CourseErrorCode.RegisteredCourseNotFound,
                    $"Registered course with ID {registeredCourseId} not found.");
            var member = await _context.Members
                .FirstOrDefaultAsync(m => m.Id == registeredCourse.MemberId) ?? throw new CourseException(
                    CourseErrorCode.MemberNotFound,
                    $"Member with ID {registeredCourse.MemberId} not found.");
            return member;
        }

        public async Task<List<RegisteredCourseModel>> GetRegisteredCoursesAsync(Guid memberId)
        {
            var registeredCourses = await _context.RegisteredCourses
                .Include(rc => rc.Course)
                .ThenInclude(c => c.Room)
                .Include(rc => rc.Course)
                .ThenInclude(c => c.Trainer)
                .Include(rc => rc.Member)
                .Where(rc => rc.MemberId == memberId)
                .ToListAsync() ?? throw new CourseException(
                    CourseErrorCode.RegisteredCourseNotFound,
                    $"No registered courses found for member with ID {memberId}.");
            return registeredCourses;
        }

        public async Task<UserBaseModel> GetTrainerByCourseIdAsync(Guid courseId)
        {
            var course = await _context.Courses
                .Include(c => c.Trainer)
                .FirstOrDefaultAsync(c => c.Id == courseId) ?? throw new CourseException(
                    CourseErrorCode.CourseNotFound,
                    $"Course with ID {courseId} not found.");
            var trainer = await _context.Trainers
                .FirstOrDefaultAsync(t => t.Id == course.TrainerId) ?? throw new CourseException(
                    CourseErrorCode.TrainerNotFound,
                    $"Trainer with ID {course.TrainerId} not found.");
            return trainer;
        }

        public async Task<UserBaseModel> GetTrainerByRegisteredCourseIdAsync(Guid registeredCourseId)
        {
            var registeredCourse = await _context.RegisteredCourses
                .Include(rc => rc.Course)
                .ThenInclude(c => c.Trainer)
                .FirstOrDefaultAsync(rc => rc.Id == registeredCourseId) ?? throw new CourseException(
                    CourseErrorCode.RegisteredCourseNotFound,
                    $"Registered course with ID {registeredCourseId} not found.");
            var trainer = registeredCourse.Course.Trainer
                            ?? throw new CourseException(
                                CourseErrorCode.TrainerNotFound,
                                $"Trainer not found for course ID {registeredCourse.CourseId}");

            return trainer;
        }

        public async Task RegisterForCourseAsync(Guid courseId, Guid memberId)
        {
            var course = await _context.Courses
                .FirstOrDefaultAsync(c => c.Id == courseId) ?? throw new CourseException(
                    CourseErrorCode.CourseNotFound,
                    $"Course with ID {courseId} not found.");
            var member = await _context.Members
                .FirstOrDefaultAsync(m => m.Id == memberId) ?? throw new CourseException(
                    CourseErrorCode.MemberNotFound,
                    $"Member with ID {memberId} not found.");
            var registeredCourses = await _context.RegisteredCourses
                .Include(rc => rc.Course)
                .Where(rc => rc.MemberId == memberId &&
                            (rc.Status == CourseStatusCode.Upcoming.ToString() || rc.Status == CourseStatusCode.Ongoing.ToString()))
                .ToListAsync();
            if (course.Status == CourseStatusCode.Cancelled.ToString())
                throw new CourseException(
                    CourseErrorCode.InvalidCourseStatus,
                    "Cannot register for a course that cancelled.");
            if (course.Status == CourseStatusCode.Completed.ToString())
                throw new CourseException(
                    CourseErrorCode.InvalidCourseStatus,
                    "Cannot register for a course that completed.");
            string status = course.StartDate switch
            {
                DateTime startDate when startDate < DateTime.UtcNow => CourseStatusCode.Ongoing.ToString(),
                DateTime startDate when startDate > DateTime.UtcNow => (string)CourseStatusCode.Upcoming.ToString(),
                _ => throw new CourseException(
                                        CourseErrorCode.InvalidCourseStatus,
                                        "Invalid course status."),
            };

            foreach (var reg in registeredCourses)
            {
                var regDays = reg.Course.TrainingDays;
                var regStartTime = reg.Course.StartTime;
                var regEndTime = reg.Course.EndTime;

                if (regDays.Intersect(course.TrainingDays).Any())
                {
                    // Nếu ngày trùng, check giờ có chồng lên không
                    bool isTimeOverlap = course.StartTime < regEndTime && course.EndTime > regStartTime;
                    if (isTimeOverlap)
                    {
                        throw new CourseException(
                            CourseErrorCode.ConflictSchedule,
                            "Schedule conflict: time overlaps with an existing registered course.");
                    }
                }
            }

            var registeredCourse = new RegisteredCourseModel
            {
                Id = Guid.NewGuid(),
                CourseId = courseId,
                MemberId = memberId,
                RegistrationDate = DateTime.UtcNow,
                Status = status,
                Course = course,
                Member = member
            };

            member.CurrentBalance -= course.Price;
            if (member.CurrentBalance < 0)
                throw new CourseException(
                    CourseErrorCode.InsufficientBalance,
                    "Insufficient balance to register for the course.");

            await _context.RegisteredCourses.AddAsync(registeredCourse);
            await _context.SaveChangesAsync();
        }

        public async Task UnregisterFromCourseAsync(Guid courseId, Guid memberId)
        {
            var registeredCourse = await _context.RegisteredCourses
                .FirstOrDefaultAsync(rc => rc.CourseId == courseId && rc.MemberId == memberId) ?? throw new CourseException(
                    CourseErrorCode.RegisteredCourseNotFound,
                    $"No registered course found for member with ID {memberId} or course with ID {courseId}.");
            _context.RegisteredCourses.Remove(registeredCourse);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateCourseAsync(Guid courseId, UpdateCourseDTO updateCourseDTO)
        {
            var course = await _context.Courses
                .FirstOrDefaultAsync(c => c.Id == courseId) ?? throw new CourseException(
                    CourseErrorCode.CourseNotFound,
                    $"Course with ID {courseId} not found.");
        }
    }
}