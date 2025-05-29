using System.ComponentModel.DataAnnotations;

namespace Server.DTOs.User
{
    public class DepositDTO
    {
        [Range(1000, 1000000, ErrorMessage = "Amount must be between 100000 and 1000000")]
        public required float Amount { get; set; }
    }
}