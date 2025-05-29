using Server.Enums.ErrorCodes;

namespace Server.Middlewares
{
    public class CourseException(CourseErrorCode errorCode, string message) : Exception(message)
    {
        public CourseErrorCode ErrorCode { get; set; } = errorCode;

    }
}
