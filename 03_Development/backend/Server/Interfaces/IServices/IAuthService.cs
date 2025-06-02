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
        Task ChangePassword(Guid accountId, string oldPassword, string newPassword);
        Task<string> RequestForgotPassword(string email);
        Task ResetPassword(string password, string confirmPassword, string resetCode);
    }
}