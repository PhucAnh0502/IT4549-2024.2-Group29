using Server.DTOs.Auth;
using Server.Enums.Auth;
using Server.Models.Account;

namespace Server.Interfaces.IServices
{
    public interface IAuthService
    {
        Task <GetAccountDTO> Login(string email, string password);
        Task<GetAccountDTO?> GetUser(Guid accountId);
        Task Register(RegisterDTO registerDTO, RoleCode rolerole);
    }
}