using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Enums.ErrorCodes;
using Server.Helpers;
using Server.Interfaces.IServices;
using Server.Middlewares;
using Server.Models.Account;

namespace Server.Services;

public class ActivationService : IActivationService
{
    private readonly DatabaseContext _context;
    private readonly IBcryptService _bcryptService;

    public ActivationService(DatabaseContext context, IBcryptService bcryptService) 
    {
        _context = context;
        _bcryptService = bcryptService;
    }
    
    //Active account service
    public async Task<string> GetActiveCode(string email, string password)
    {
        var account = await _context.Accounts.FirstOrDefaultAsync(a => a.Email == email)
                      ?? throw new AuthException(AuthErrorCode.AccountNotExist, "Account does not exist.");

        if (!_bcryptService.VerifyPassword(password, account.Password))
            throw new AuthException(AuthErrorCode.InvalidPassword, "Password is not correct.");

        if (account.IsActivated)
            throw new AuthException(AuthErrorCode.AccountAlreadyActivated, "Account is already activated.");

        return await AuthCodeHelper.GenerateOrUpdateCode<ActivationCodeModel>(_context.ActivationCodes, _context, account.Id, account);
    }
    
    public async Task ActivateAccount(string activationCode)
    {
        var activationEntry = await _context.ActivationCodes.FirstOrDefaultAsync(a => a.Code == activationCode) ?? throw new AuthException(AuthErrorCode.InvalidActivationCode, "Activation code is not valid.");
        if (activationEntry.ExpiryTime < DateTime.UtcNow)
            throw new AuthException(AuthErrorCode.ActivationCodeExpired, "Activation code is expired.");

        var account = await _context.Accounts.FirstOrDefaultAsync(a => a.Id == activationEntry.AccountId) ?? throw new AuthException(AuthErrorCode.AccountNotExist, "Account does not exist.");
        account.IsActivated = true;
        _context.ActivationCodes.Remove(activationEntry);
        await _context.SaveChangesAsync();
    }
}