using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Server.Enums.ErrorCodes;
using Server.Middlewares;
using Server.Models.Account;

namespace Server.Helpers
{
    public class AuthCodeHelper
    {
        public static string GenerateActivationCode(Guid accountId)
        {
            using var sha256 = SHA256.Create();

            string input = accountId.ToString() + DateTime.UtcNow.Ticks.ToString();
            byte[] hashBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(input));
            string base64Hash = Convert.ToBase64String(hashBytes);
            string activationCode = new string([.. base64Hash.Where(char.IsLetterOrDigit)]).Substring(0, 6).ToUpper();

            return activationCode;
        }
        public static async Task<string> GenerateOrUpdateCode<T>(
        DbSet<T> codeTable,
        DbContext context,
        Guid accountId,
        AccountModel account) where T : class, ICodeEntity, new()
        {
            DateTime currentTime = DateTime.UtcNow;
            string newCode;

            var existingCode = await codeTable.FirstOrDefaultAsync(a => a.AccountId == accountId);

            if (existingCode != null)
            {
                TimeSpan timeSinceLastRequest = currentTime - existingCode.LastRequestedTime;
                if (timeSinceLastRequest.TotalSeconds < 60)
                    throw new AuthException(AuthErrorCode.RequestTooFrequent, "Request too frequent.");

                existingCode.Code = AuthCodeHelper.GenerateActivationCode(accountId);
                existingCode.ExpiryTime = currentTime.AddMinutes(10);
                existingCode.LastRequestedTime = currentTime;
                newCode = existingCode.Code;
            }
            else
            {
                newCode = AuthCodeHelper.GenerateActivationCode(accountId);
                var newEntry = Activator.CreateInstance<T>();
                    newEntry.Id = Guid.NewGuid();
                    newEntry.AccountId = accountId;
                    newEntry.Code = newCode;
                    newEntry.ExpiryTime = currentTime.AddMinutes(10);
                    newEntry.LastRequestedTime = currentTime;
                    newEntry.Account = account;
                codeTable.Add(newEntry);
            }

            await context.SaveChangesAsync();
            return newCode;
        }
    }

    public interface ICodeEntity
    {
        Guid Id { get; set; }
        Guid AccountId { get; set; }
        string Code { get; set; }
        DateTime ExpiryTime { get; set; }
        DateTime LastRequestedTime { get; set; }
        AccountModel? Account { get; set; }
    }
}
