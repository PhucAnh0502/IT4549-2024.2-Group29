using System.ComponentModel.DataAnnotations;

namespace Server.DTOs.Auth
{
    public class RequestResetDTO
    {
        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid email format.")]
        public required string Email { get; set; }
    }
}
