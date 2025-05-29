using Server.Helpers;

namespace Server.Models.Account
{
    public class ResetCodeModel : ICodeEntity
    {
        public Guid Id { get; set; }
        public Guid AccountId { get; set; }
        public string Code { get; set; } = string.Empty;
        public DateTime ExpiryTime { get; set; }
        public DateTime LastRequestedTime { get; set; }
        public AccountModel? Account { get; set; }
    }
}