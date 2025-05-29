using Server.Models.User;

namespace Server.Models.Course
{
    public class RegisteredCourseModel
    {
        public Guid Id { get; set; }
        public Guid CourseId { get; set; }
        public Guid MemberId { get; set; }
        public required DateTime RegistrationDate { get; set; } // Thêm required
        public required string Status { get; set; }
        public CourseModel Course { get; set; } = null!; // Navigation property
        public MemberModel Member { get; set; } = null!; // Navigation property
    }
}