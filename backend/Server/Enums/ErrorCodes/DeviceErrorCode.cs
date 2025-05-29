namespace Server.Enums.ErrorCodes
{
    public enum DeviceErrorCode
    {
        DeviceAlreadyExist = 3000,
        DeviceNotFound = 3001,
        DeviceNotFitRoomType = 3002,
        DeviceUnderMaintenance = 3003,
        DeviceNotAvailable = 3004,
        DeviceIsUsing = 3005,
        DeviceStatusInvalid = 3006,
        DeviceBookingConflict = 3007,
        InvalidBookingTime = 3008,
        InvalidBookingDate = 3009,
        InvalidDeviceType = 3010,
    }
}
