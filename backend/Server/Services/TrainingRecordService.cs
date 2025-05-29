using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.DTOs.TrainingRecord;
using Server.Enums.ErrorCodes;
using Server.Interfaces.IServices;
using Server.Middlewares;
using Server.Models.TrainingRecord;
using Server.Models.User;

namespace Server.Services
{
    public class TrainingRecordService(DatabaseContext context) : ITrainingRecordService
    {
        private readonly DatabaseContext _context = context;

        public async Task CreateTrainingRecordAsync(CreateTrainingRecordDTO trainingRecordDto)
        {
            var existingRecord = await _context.TrainingRecords
                .FirstOrDefaultAsync(tr => tr.RegisteredCourseId == trainingRecordDto.RegisteredCourseId);
            if (existingRecord != null)
            {
                throw new TrainingRecordException(TrainingRecordErrorCode.TrainingRecordAlreadyExist, "Training record already exists.");
            }

            var trainingRecord = new TrainingRecordModel
            {
                Id = Guid.NewGuid(),
                RegisteredCourseId = trainingRecordDto.RegisteredCourseId,
                Progress = 0,
                CreatedAt = DateTime.UtcNow,
                Status = []
            };

            await _context.TrainingRecords.AddAsync(trainingRecord);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteTrainingRecordAsync(Guid id)
        {
            var trainingRecord = await _context.TrainingRecords
                .FirstOrDefaultAsync(tr => tr.Id == id)
                ?? throw new TrainingRecordException(TrainingRecordErrorCode.TrainingRecordNotFound, "Training record not found.");
            _context.TrainingRecords.Remove(trainingRecord);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateTrainingRecordAsync(Guid id, UpdateTrainingRecordDTO trainingRecordDto)
        {
            var trainingRecord = await _context.TrainingRecords
                .FirstOrDefaultAsync(tr => tr.Id == id)
                ?? throw new TrainingRecordException(TrainingRecordErrorCode.TrainingRecordNotFound, "Training record not found.");

            trainingRecord.Status = (trainingRecordDto.Status ?? [])
                                        .ToDictionary(
                                            pair => pair.Key,
                                            pair => new TrainingDayStatus
                                            {
                                                Status = pair.Value.Status,
                                                Note = pair.Value.Note
                                            });
            trainingRecord.Progress = trainingRecordDto.Progress;

            _context.TrainingRecords.Update(trainingRecord);
            await _context.SaveChangesAsync();
        }

        public async Task<List<GetTrainingRecordDTO>?> GetAllTrainingRecordsAsync()
        {
            // Lấy tất cả bản ghi, tránh truy vấn trực tiếp vào Dictionary
            var trainingRecords = await _context.TrainingRecords.ToListAsync();
            
            // Chuyển đổi dữ liệu sau khi lấy về
            return [.. trainingRecords.Select(tr => new GetTrainingRecordDTO
            {
                Id = tr.Id,
                RegisteredCourseId = tr.RegisteredCourseId,
                Status = tr.Status.ToDictionary(
                    pair => pair.Key,
                    pair => new TrainingDayStatusDTO
                    {
                        Status = pair.Value.Status,
                        Note = pair.Value.Note
                    }),
                Progress = tr.Progress
            })];
        }

        public async Task<GetTrainingRecordDTO> GetTrainingRecordByIdAsync(Guid id)
        {
            // Lấy một bản ghi cụ thể
            var trainingRecord = await _context.TrainingRecords
                .FirstOrDefaultAsync(tr => tr.Id == id)
                ?? throw new TrainingRecordException(TrainingRecordErrorCode.TrainingRecordNotFound, "Training record not found.");
            
            // Chuyển đổi sau khi lấy về
            return new GetTrainingRecordDTO
            {
                Id = trainingRecord.Id,
                RegisteredCourseId = trainingRecord.RegisteredCourseId,
                Status = trainingRecord.Status.ToDictionary(
                    pair => pair.Key,
                    pair => new TrainingDayStatusDTO
                    {
                        Status = pair.Value.Status,
                        Note = pair.Value.Note
                    }),
                Progress = trainingRecord.Progress
            };
        }

        public async Task<List<GetTrainingRecordDTO>?> GetTrainingRecordsByCourseIdAsync(Guid courseId)
        {
            var registeredCourse = await _context.RegisteredCourses
                .FirstOrDefaultAsync(rc => rc.CourseId == courseId)
                ?? throw new CourseException(CourseErrorCode.RegisteredCourseNotFound, "Registered course not found.");
            
            // Lấy bản ghi theo RegisteredCourseId
            var trainingRecords = await _context.TrainingRecords
                .Where(tr => tr.RegisteredCourseId == registeredCourse.Id)
                .ToListAsync();
            
            // Chuyển đổi sau khi lấy về
            return [.. trainingRecords.Select(tr => new GetTrainingRecordDTO
            {
                Id = tr.Id,
                RegisteredCourseId = tr.RegisteredCourseId,
                Status = tr.Status.ToDictionary(
                    pair => pair.Key,
                    pair => new TrainingDayStatusDTO
                    {
                        Status = pair.Value.Status,
                        Note = pair.Value.Note
                    }),
                Progress = tr.Progress
            })];
        }

        public async Task<List<GetTrainingRecordDTO>?> GetTrainingRecordsByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            // Lấy bản ghi theo khoảng thời gian
            var trainingRecords = await _context.TrainingRecords
                .Where(tr => tr.CreatedAt >= startDate && tr.CreatedAt <= endDate)
                .ToListAsync();
            
            // Chuyển đổi sau khi lấy về
            return [.. trainingRecords.Select(tr => new GetTrainingRecordDTO
            {
                Id = tr.Id,
                RegisteredCourseId = tr.RegisteredCourseId,
                Status = tr.Status.ToDictionary(
                    pair => pair.Key,
                    pair => new TrainingDayStatusDTO
                    {
                        Status = pair.Value.Status,
                        Note = pair.Value.Note
                    }),
                Progress = tr.Progress
            })];
        }

        public async Task<List<GetTrainingRecordDTO>?> GetTrainingRecordsByUserIdAsync(Guid userId)
        {
            // Lấy danh sách RegisteredCourses của user
            var registeredCourseIds = await _context.RegisteredCourses
                .Where(rc => rc.MemberId == userId)
                .Select(rc => rc.Id)
                .ToListAsync();

            // Lấy bản ghi theo danh sách RegisteredCourseId
            var trainingRecords = await _context.TrainingRecords
                .Where(tr => registeredCourseIds.Contains(tr.RegisteredCourseId))
                .ToListAsync();
                
            if (trainingRecords == null || trainingRecords.Count == 0)
            {
                throw new TrainingRecordException(TrainingRecordErrorCode.TrainingRecordNotFound, "Training records not found.");
            }
            
            // Chuyển đổi sau khi lấy về
            return [.. trainingRecords.Select(tr => new GetTrainingRecordDTO
            {
                Id = tr.Id,
                RegisteredCourseId = tr.RegisteredCourseId,
                Status = tr.Status.ToDictionary(
                    pair => pair.Key,
                    pair => new TrainingDayStatusDTO
                    {
                        Status = pair.Value.Status,
                        Note = pair.Value.Note
                    }),
                Progress = tr.Progress
            })];
        }

        public async Task<UserBaseModel> GetTrainerByTrainingRecordIdAsync(Guid id)
        {
            // Sử dụng Include để tối ưu việc load các dữ liệu liên quan
            var trainingRecord = await _context.TrainingRecords
                .FirstOrDefaultAsync(tr => tr.Id == id)
                ?? throw new TrainingRecordException(TrainingRecordErrorCode.TrainingRecordNotFound, "Training record not found.");
                
            var registeredCourse = await _context.RegisteredCourses
                .Include(rc => rc.Course)
                .ThenInclude(c => c.Trainer)
                .FirstOrDefaultAsync(rc => rc.Id == trainingRecord.RegisteredCourseId)
                ?? throw new CourseException(CourseErrorCode.RegisteredCourseNotFound, "Registered course not found.");
                
            var trainer = registeredCourse.Course.Trainer 
                ?? throw new UserException(UserErrorCode.UserNotFound, "Trainer user not found.");
                
            return trainer;
        }

        public async Task<List<GetTrainingRecordDTO>?> GetTrainingRecordsByTrainerIdAsync(Guid trainerId)
        {
            var registeredCourses = await _context.RegisteredCourses
                .Where(rc => rc.Course.TrainerId == trainerId)
                .Select(rc => rc.Id)
                .ToListAsync();
            if (registeredCourses == null || registeredCourses.Count == 0)
            {
                throw new CourseException(CourseErrorCode.RegisteredCourseNotFound, "Registered course not found.");
            }
            var trainingRecords = await _context.TrainingRecords
                .Where(tr => registeredCourses.Contains(tr.RegisteredCourseId))
                .ToListAsync();
                
            // Chuyển đổi sau khi lấy về
            return [.. trainingRecords.Select(tr => new GetTrainingRecordDTO
            {
                Id = tr.Id,
                RegisteredCourseId = tr.RegisteredCourseId,
                Status = tr.Status.ToDictionary(
                    pair => pair.Key,
                    pair => new TrainingDayStatusDTO
                    {
                        Status = pair.Value.Status,
                        Note = pair.Value.Note
                    }),
                Progress = tr.Progress
            })];
        }
    }
}