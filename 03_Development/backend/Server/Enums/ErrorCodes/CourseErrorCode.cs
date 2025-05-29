namespace Server.Enums.ErrorCodes
{
    public enum CourseErrorCode
    {
        CourseNotFound = 2000,
        InvalidCourseStatus = 2001,
        RoomNotFound = 2002,
        InsufficientBalance = 2003,
        TrainerNotFound = 2004,
        InvalidStartDate = 2005,
        InvalidEndDate = 2006,
        InvalidPrice = 2007,
        RegisteredCourseNotFound = 2008,
        MemberNotFound = 2009,
        InvalidTrainerSpecialization = 2010,
        InvalidTime = 2011,
        ConflictSchedule = 2012
    }
}
