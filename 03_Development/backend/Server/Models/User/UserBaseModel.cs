using Server.Interfaces.IModels;
using Server.Models.Account;

namespace Server.Models.User
{
    public class UserBaseModel : IUserModel
    {
        public Guid Id { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required DateTime DateOfBirth { get; set; }
        public float CurrentBalance { get; set; }
        public Guid AccountId { get; set; }
        public AccountModel Account { get; set; } = null!;
    }
}