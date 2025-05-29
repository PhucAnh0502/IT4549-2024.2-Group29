using Server.Enums.ErrorCodes;

namespace Server.Middlewares
{
    public class ReportException(ReportErrorCode errorCode, string message) : Exception(message)
    {
        public ReportErrorCode ErrorCode { get; set; } = errorCode;
    }
}