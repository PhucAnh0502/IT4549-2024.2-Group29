using Server.Enums.Report;

namespace Server.DTOs.Report
{
    public class ChangeReportStatusDTO
    {
        public Guid Id { get; set; }
        public required ReportStatusCode ReportStatus { get; set; }
    }
}