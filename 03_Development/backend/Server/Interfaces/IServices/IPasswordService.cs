namespace Server.Interfaces.IServices;

public interface IPasswordService
{
    Task ChangePassword(Guid accountId, string oldPassword, string newPassword);
    Task<string> RequestForgotPassword(string email);
    Task ResetPassword(string password, string confirmPassword, string resetCode);
}