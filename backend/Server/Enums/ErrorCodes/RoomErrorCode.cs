namespace Server.Enums.ErrorCodes
{
    public enum RoomErrorCode
    {
        RoomNotFound = 4000,
        RoomAlreadyExist = 4001,
        RoomAlreadyAvailable = 4002,
        RoomAlreadyUnderMaintenance = 4003,
        RoomFull = 4004,
        InvalidRoomTypeEnum = 4005
    }
}
