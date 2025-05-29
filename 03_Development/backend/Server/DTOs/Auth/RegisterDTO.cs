using System.ComponentModel.DataAnnotations;

namespace Server.DTOs.Auth
{
    public class RegisterDTO
    {
        [EmailAddress]
        public required string Email { get; set; }
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters long")]
        public required string Password { get; set; }
        [Compare("Password", ErrorMessage = "Passwords do not match")]
        public required string ConfirmPassword { get; set; }
        public required int Role { get; set; }

        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        public required DateOnly DateOfBirth { get; set; }
        public required string PhoneNumber { get; set; }
        public int? Specialization { get; set; } // 0: None, 1: Yoga, 2: Zumba, 3: Dance, 4: Boxing, 5: Cardio, 6: Weightlifting
        public int? Department { get; set; } // 0: None, 1: Manager, 2: Trainer, 3: Member
    }
}