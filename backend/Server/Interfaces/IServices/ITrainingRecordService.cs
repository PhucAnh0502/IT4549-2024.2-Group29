using Server.DTOs.TrainingRecord;
using Server.Models.TrainingRecord;
using Server.Models.User;

namespace Server.Interfaces.IServices
{
    public interface ITrainingRecordService
    {
        Task CreateTrainingRecordAsync(CreateTrainingRecordDTO trainingRecordDto);
        Task<GetTrainingRecordDTO> GetTrainingRecordByIdAsync(Guid id);
        Task<UserBaseModel> GetTrainerByTrainingRecordIdAsync(Guid id);
        Task<List<GetTrainingRecordDTO>?> GetTrainingRecordsByTrainerIdAsync(Guid trainerId);
        Task<List<GetTrainingRecordDTO>?> GetAllTrainingRecordsAsync();
        Task UpdateTrainingRecordAsync(Guid id, UpdateTrainingRecordDTO trainingRecordDto);
        Task DeleteTrainingRecordAsync(Guid id);
        Task <List<GetTrainingRecordDTO>?> GetTrainingRecordsByUserIdAsync(Guid userId);
        Task<List<GetTrainingRecordDTO>?> GetTrainingRecordsByCourseIdAsync(Guid courseId);
        Task<List<GetTrainingRecordDTO>?> GetTrainingRecordsByDateRangeAsync(DateTime startDate, DateTime endDate);

    }
}