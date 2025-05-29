namespace Server.DTOs.TrainingRecord
{
    public class GetTrainingRecordDTO
    {
        public Guid Id { get; set; }

        public Guid RegisteredCourseId { get; set; }

        public Dictionary<string, TrainingDayStatusDTO> Status { get; set; } = new();

        public float Progress { get; set; }
    }
}