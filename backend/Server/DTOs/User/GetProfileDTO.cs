using Server.Models.User;

namespace Server.DTOs.User
{
    public class GetProfileDTO
    {
        public required string Email { get; set; }
        public required string Role { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string Specialization { get; set; }
        public required string Department { get; set; }
        public required float CurrentBalance { get; set; }
        public required DateTime DateOfBirth { get; set; }
    }
}