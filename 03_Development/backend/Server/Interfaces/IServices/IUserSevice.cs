using Server.DTOs.User;
using Server.Models.Account;
using Server.Models.User;

namespace Server.Interfaces.IServices
{
    public interface IUserService
    {
        Task<AccountModel?> GetAccountAsync(Guid accountId);
        Task<GetProfileDTO> GetProfileAsync(Guid accountId);
        Task<UserBaseModel> GetUserAsync(Guid userId);
        Task<UserBaseModel> GetUserAsyncForHR(Guid userId);
        Task UpdateProfileAsync(Guid userId, UpdateProfileDTO model);
        Task<string?> GetTrainerSpecialization(Guid userId);
        Task<List<AccountModel>> GetAccountsAsync();
        Task<List<UserBaseModel>> GetUsersAsync();
        Task DeleteUserAsync(Guid userId);
        Task DepositAsync(Guid userId, DepositDTO model);
    }
}