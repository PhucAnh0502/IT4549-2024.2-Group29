using System.ComponentModel.DataAnnotations;
using Server.Models.Account;

namespace Server.Interfaces.IModels
{
    public interface IUserModel
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public float CurrentBalance { get; set; }
        public Guid AccountId { get; set; } //foreign key
    }
}