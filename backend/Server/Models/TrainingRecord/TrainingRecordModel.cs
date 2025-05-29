namespace Server.Models.TrainingRecord
{
    public class TrainingRecordModel
    {
        public Guid Id { get; set; }
        public Guid RegisteredCourseId { get; set; }

        public DateTime CreatedAt { get; set; }
        public required Dictionary<string, TrainingDayStatus> Status { get; set; } = [];

        public required float Progress { get; set; }
    }

    public class TrainingDayStatus
    {
        public required string Status { get; set; }
        public required string Note { get; set; }
    }
}
