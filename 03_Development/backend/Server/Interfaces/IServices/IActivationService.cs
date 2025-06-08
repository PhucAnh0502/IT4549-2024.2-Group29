namespace Server.Interfaces.IServices;

public interface IActivationService
{
    Task<string> GetActiveCode(string email, string password);
    Task ActivateAccount(string activationCode);
}