namespace Server.DTOs.TrainingRecord
{
    public class UpdateTrainingRecordDTO
    {
        public Guid Id { get; set; } 

        public Dictionary<string, TrainingDayStatusDTO>? Status { get; set; }
        public required float Progress { get; set; }
    }  
}