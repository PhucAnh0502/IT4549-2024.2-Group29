using Server.Enums.Course;

namespace Server.DTOs.Course
{
    public class CreateCourseDTO
    {
        public required string Name { get; set; }
        public required string Description { get; set; }
        public required DateTime StartDate { get; set; }
        public required DateTime EndDate { get; set; }
        public required TimeSpan StartTime { get; set; }
        public required TimeSpan EndTime { get; set; }
        public required float Price { get; set; }
        public required CourseTypeCode Type { get; set; } // CourseTypeCode
        public required string RoomName { get; set; } // Room name
        public required List<DayOfWeek> TrainingDays { get; set; }
    }
}