using Server.Enums.ErrorCodes;

namespace Server.Middlewares
{
    public class DeviceException(DeviceErrorCode errorCode, string message) : Exception(message)
    {
        public DeviceErrorCode ErrorCode { get; set; } = errorCode;
    }
}