using Server.Enums.ErrorCodes;

namespace Server.Middlewares
{
    public class TrainingRecordException(TrainingRecordErrorCode errorCode, string message) : Exception(message)
    {
        public TrainingRecordErrorCode ErrorCode { get; set; } = errorCode;
    }
}