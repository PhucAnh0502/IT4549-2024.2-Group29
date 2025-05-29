using Server.Enums;

namespace Server.DTOs.Report
{
    public class CreateReportDTO
    {
        public required string Title { get; set; }
        public required ReportTypeCode ReportType { get; set; }
        public required string Content { get; set; }
    }
}