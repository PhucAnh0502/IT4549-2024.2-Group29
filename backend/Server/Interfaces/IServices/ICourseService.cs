using Server.DTOs.Course;
using Server.Models.Course;
using Server.Models.User;

namespace Server.Interfaces.IServices
{
    public interface ICourseService
    {
        Task CreateCourseAsync(CreateCourseDTO createCourseDTO, Guid trainerId);
        Task DeleteCourseAsync(Guid courseId);
        Task<CourseModel> GetCourseByIdAsync(Guid courseId);
        Task<List<CourseModel>> GetCoursesByTrainerIdAsync(Guid trainerId);
        Task<UserBaseModel> GetTrainerByCourseIdAsync(Guid courseId);
        Task<UserBaseModel> GetTrainerByRegisteredCourseIdAsync(Guid registeredCourseId);
        Task<UserBaseModel> GetMemberByRegisteredCourseIdAsync(Guid registeredCourseId);
        Task<List<CourseModel>> GetCoursesByRoomIdAsync(Guid roomId);
        Task<List<CourseModel>> GetCoursesByTypeAsync(string type);
        Task<List<CourseModel>> GetCoursesByStatusAsync(string status);
        Task<List<CourseModel>> GetCoursesByDateRangeAsync(DateTime startDate, DateTime endDate);
        Task<List<CourseModel>> GetCoursesByPriceRangeAsync(float minPrice, float maxPrice);
        Task<List<CourseModel>> GetCoursesByNameAsync(string name);
        Task<List<CourseModel>> GetCoursesAsync();
        Task<List<CourseModel>> GetCoursesByMemberIdAsync(Guid memberId);
        Task<List<RegisteredCourseModel>> GetRegisteredCoursesAsync(Guid memberId);
        Task<string> GetCourseTypeByIdAsync(Guid courseId);
        Task RegisterForCourseAsync(Guid courseId, Guid memberId);
        Task UnregisterFromCourseAsync(Guid courseId, Guid memberId);
        Task UpdateCourseAsync(Guid courseId, UpdateCourseDTO updateCourseDTO);
    }
}