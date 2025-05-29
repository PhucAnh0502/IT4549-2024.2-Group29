

using System.ComponentModel.DataAnnotations.Schema;
using Server.Models.Room;
using Server.Models.User;

namespace Server.Models.Course
{
    public class CourseModel
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public required string Description { get; set; }
        public required DateTime StartDate { get; set; }
        public required DateTime EndDate { get; set; }
        public required TimeSpan StartTime { get; set; }  // giờ bắt đầu mỗi buổi học
        public required TimeSpan EndTime { get; set; }    // giờ kết thúc mỗi buổi học
        public required string Type { get; set; } // CourseTypeCode
        public required string Status { get; set; } // CourseStatusCode
        public string? TrainingDaysString { get; set; }

        // Không lưu trong DB, dùng trong code
        [NotMapped]
        public List<DayOfWeek> TrainingDays
        {
            get => TrainingDaysString?
                        .Split(',', StringSplitOptions.RemoveEmptyEntries)
                        .Select(day => Enum.Parse<DayOfWeek>(day))
                        .ToList() ?? new List<DayOfWeek>();

            set => TrainingDaysString = string.Join(",", value);
        }
        public required float Price { get; set; }

        // Navigation Properties
        public Guid RoomId { get; set; }
        public required RoomModel Room { get; set; }

        public Guid TrainerId { get; set; }
        public required TrainerModel Trainer { get; set; }
    }
}