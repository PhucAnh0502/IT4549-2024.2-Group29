using Server.Enums.ErrorCodes;

namespace Server.Middlewares
{
    public class RoomException(RoomErrorCode errorCode, string message) : Exception(message)
    {
        public RoomErrorCode ErrorCode { get; set; } = errorCode;
    }
}