using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.DTOs.Report;
using Server.Enums.ErrorCodes;
using Server.Enums.Report;
using Server.Interfaces.IServices;
using Server.Middlewares;
using Server.Models.Report;

namespace Server.Services
{
    public class ReportService(DatabaseContext context) : IReportService
    {

        private readonly DatabaseContext _context = context;

        public async Task CreateReportAsync(Guid userId, CreateReportDTO createReportDTO)
        {
            var user = await _context.Users.FindAsync(userId) ?? throw new UserException(UserErrorCode.UserNotFound, "User not found.");
            var report = new ReportModel
            {
                Id = Guid.NewGuid(),
                Title = createReportDTO.Title,
                ReportType = createReportDTO.ReportType.ToString(),
                Content = createReportDTO.Content,
                Status = ReportStatusCode.Pending.ToString(),
                CreatedAt = DateTime.UtcNow,
                CreatedBy = userId,
                CreatedByUser = user
            };

            await _context.Reports.AddAsync(report);
            await _context.SaveChangesAsync();
        }
        public async Task ChangeReportStatusAsync(ChangeReportStatusDTO changeReportStatusDTO)
        {
            var report = await _context.Reports.FirstOrDefaultAsync(r => r.Id == changeReportStatusDTO.Id)
                ?? throw new ReportException(ReportErrorCode.ReportNotFound, "Report not found.");

            if (report.Status == changeReportStatusDTO.ReportStatus.ToString())
            {
                throw new ReportException(ReportErrorCode.ReportAlreadyInThisStatus, "Report already in this status.");
            }

            report.Status = changeReportStatusDTO.ReportStatus.ToString();
            _context.Reports.Update(report);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateReportAsync(UpdateReportDTO updateReportDTO)
        {
            var report = await _context.Reports.FirstOrDefaultAsync(r => r.Id == updateReportDTO.Id)
                ?? throw new ReportException(ReportErrorCode.ReportNotFound, "Report not found.");

            if (report.Status == ReportStatusCode.Resolved.ToString() || report.Status == ReportStatusCode.Rejected.ToString())
            {
                throw new ReportException(ReportErrorCode.ReportAlreadyInThisStatus, "Cannot update completed report.");
            }

            report.Title = updateReportDTO.Title;
            report.Content = updateReportDTO.Content;
            report.ReportType = updateReportDTO.ReportType.ToString();

            _context.Reports.Update(report);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteReportAsync(Guid reportId)
        {
            var report = await _context.Reports.FirstOrDefaultAsync(r => r.Id == reportId)
                ?? throw new ReportException(ReportErrorCode.ReportNotFound, "Report not found.");
            _context.Reports.Remove(report);
            await _context.SaveChangesAsync();
        }

        public async Task<ReportModel> GetReportByIdAsync(Guid reportId)
        {
            var report = await _context.Reports
                .Include(r => r.CreatedByUser)
                .FirstOrDefaultAsync(r => r.Id == reportId)
                ?? throw new ReportException(ReportErrorCode.ReportNotFound, "Report not found.");
            return report;
        }

        public async Task<List<ReportModel>?> GetReportsAsync()
        {
            var reports = await _context.Reports
                .Include(r => r.CreatedByUser)
                .ToListAsync();
            return reports;
        }

        public async Task<List<ReportModel>?> GetReportsByStatusAsync(string status)
        {
            var reports = await _context.Reports
                .Include(r => r.CreatedByUser)
                .Where(r => r.Status == status)
                .ToListAsync();
            return reports;
        }

        public async Task<List<ReportModel>?> GetReportsByTypeAsync(string type)
        {
            var reports = await _context.Reports
                .Include(r => r.CreatedByUser)
                .Where(r => r.ReportType == type)
                .ToListAsync();
            return reports;
        }

        public async Task<List<ReportModel>?> GetReportsByUserIdAsync(Guid userId)
        {
            var reports = await _context.Reports
                .Include(r => r.CreatedByUser)
                .Where(r => r.CreatedBy == userId)
                .ToListAsync();
            return reports;
        }
    }
}