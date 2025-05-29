using Server.DTOs.Report;
using Server.Models.Report;

namespace Server.Interfaces.IServices
{
    public interface IReportService
    {
        Task CreateReportAsync(Guid userId, CreateReportDTO createReportDTO);
        Task<ReportModel> GetReportByIdAsync(Guid reportId);
        Task UpdateReportAsync(UpdateReportDTO updateReportDTO);
        Task ChangeReportStatusAsync(ChangeReportStatusDTO changeReportStatusDTO);
        Task DeleteReportAsync(Guid reportId);
        Task<List<ReportModel>?> GetReportsAsync();
        Task<List<ReportModel>?> GetReportsByUserIdAsync(Guid userId);
        Task<List<ReportModel>?> GetReportsByStatusAsync(string status);
        Task<List<ReportModel>?> GetReportsByTypeAsync(string type);
    }
}