namespace Server.DTOs.TrainingRecord
{
    public class CreateTrainingRecordDTO
    {
        public Guid RegisteredCourseId { get; set; }

        public required Dictionary<string, TrainingDayStatusDTO> Status { get; set; } = [];

        public required float Progress { get; set; }
    }

    public class TrainingDayStatusDTO
    {
        public required string Status { get; set; }
        public required string Note { get; set; }
    }
}