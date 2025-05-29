namespace Server.DTOs.Auth
{
    public class GetAccountDTO
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public required string Email { get; set; }
        public required string Role { get; set; }
        public string? Department { get; set; }          
        public string? Specialization { get; set; }      
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public DateTime DateOfBirth { get; set; }
        public float CurrentBalance { get; set; }
    }
}