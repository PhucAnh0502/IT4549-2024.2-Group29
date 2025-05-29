using Server.Models.User;

namespace Server.Models.Report
{
    public class ReportModel
    {
        public Guid Id {get; set;}
        public required string Title {get; set;}
        public required string ReportType {get; set;}
        public required string Content {get; set;}
        public required string Status {get; set;}
        public required DateTime CreatedAt {get; set;}
        //navigation property
        public Guid CreatedBy {get; set;}
        public required UserBaseModel CreatedByUser {get; set;}
    }
}