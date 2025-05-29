namespace Server.Enums.ErrorCodes
{
    public enum AuthErrorCode
    {
        AccountNotExist = 1000,
        AccountAlreadyExist = 1001,
        TokenExpired = 1002,
        InvalidPassword = 1003,
        AccountNotActive = 1004,
        PasswordsNotMatch = 1005,
        OldPasswordMatching = 1006,
        AccountAlreadyActivated = 1007,
        InvalidActivationCode = 1008,
        ActivationCodeExpired = 1009,
        RequestTooFrequent = 1010,
        UserNotFound = 1011,
        UnknownError = 1012,
        PasswordNotMatch = 1013,
        ResetCodeExpired = 1014,
        InvalidResetCode = 1015,
        InvalidDepartment = 1016,
        InvalidSpecialization = 1017,
        InvalidModel = 1018
    }
}
