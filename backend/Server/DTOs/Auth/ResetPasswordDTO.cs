using System.ComponentModel.DataAnnotations;

namespace Server.DTOs.Auth
{
    public class ResetPasswordDTO
    {
        public string ResetCode { get; set; } = string.Empty;
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters long")]
        public string NewPassword { get; set; } = string.Empty;
        [Compare("NewPassword", ErrorMessage = "Passwords do not match")]
        public string ConfirmPassword { get; set; } = string.Empty;
    }
}