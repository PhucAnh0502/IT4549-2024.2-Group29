using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Enums.ErrorCodes;
using Server.Helpers;
using Server.Interfaces.IServices;
using Server.Middlewares;
using Server.Models.Account;

namespace Server.Services;

public class PasswordService : IPasswordService
{
    private readonly DatabaseContext _context;
    private readonly IBcryptService _bcryptService;

    public PasswordService(DatabaseContext context, IBcryptService bcryptService) 
    {
        _context = context;
        _bcryptService = bcryptService;
    }
    
    public async Task ChangePassword(Guid accountId, string oldPassword, string newPassword)
    {
        var account = await _context.Accounts.FirstOrDefaultAsync(a => a.Id == accountId) ?? throw new AuthException(AuthErrorCode.AccountNotExist, "Account does not exist.");
        if (!_bcryptService.VerifyPassword(oldPassword, account.Password))
            throw new AuthException(AuthErrorCode.InvalidPassword, "Password is not correct.");

        if (oldPassword == newPassword)
            throw new AuthException(AuthErrorCode.OldPasswordMatching, "New password must be different from old password.");

        account.Password = _bcryptService.HashPassword(newPassword);
        await _context.SaveChangesAsync();
        
    }
    
    public async Task<string> RequestForgotPassword(string email)
    {
        var account = await _context.Accounts.FirstOrDefaultAsync(a => a.Email == email) ?? throw new AuthException(AuthErrorCode.AccountNotExist, "Account does not exist.");
        if (account.IsActivated == false)
            throw new AuthException(AuthErrorCode.AccountNotActive, "Account is not activated.");
        return await AuthCodeHelper.GenerateOrUpdateCode<ResetCodeModel>(_context.ResetCodes, _context, account.Id, account);
    }

    public async Task ResetPassword(string password, string confirmPassword, string resetCode)
    {
        if (password != confirmPassword)
            throw new AuthException(AuthErrorCode.PasswordNotMatch, "Password and confirm password do not match.");

        var resetEntry = await _context.ResetCodes.FirstOrDefaultAsync(a => a.Code == resetCode) ?? throw new AuthException(AuthErrorCode.InvalidResetCode, "Reset code is not valid.");
        if (resetEntry.ExpiryTime < DateTime.UtcNow)
            throw new AuthException(AuthErrorCode.ResetCodeExpired, "Reset code is expired.");

        var account = await _context.Accounts.FirstOrDefaultAsync(a => a.Id == resetEntry.AccountId) ?? throw new AuthException(AuthErrorCode.AccountNotExist, "Account does not exist.");
        account.Password = _bcryptService.HashPassword(password);
        _context.ResetCodes.Remove(resetEntry);
        await _context.SaveChangesAsync();
    }
    
    
}