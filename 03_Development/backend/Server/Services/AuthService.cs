using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.DTOs.Auth;
using Server.Enums.Auth;
using Server.Enums.ErrorCodes;
using Server.Helpers;
using Server.Interfaces.IServices;
using Server.Middlewares;
using Server.Models.Account;
using Server.Models.User;

namespace Server.Services
{
    public class AuthService : IAuthService
    {

        private readonly DatabaseContext _context;
        private readonly IBcryptService _bcryptService;

        public AuthService(DatabaseContext context, IBcryptService bcryptService) 
        {
            _context = context;
            _bcryptService = bcryptService;
        }   //Refractor code to match SOLID convention, 
            //For this case it is using interface instead of actual class

        //Service for authentication
        public async Task<GetAccountDTO> Login(string email, string password)
        {
            var account = await _context.Accounts.FirstOrDefaultAsync(x => x.Email == email)
                  ?? throw new AuthException(AuthErrorCode.AccountNotExist, "Account does not exist.");

            if (!_bcryptService.VerifyPassword(password, account.Password))
                throw new AuthException(AuthErrorCode.InvalidPassword, "Password is not correct.");

            if (!account.IsActivated)
                throw new AuthException(AuthErrorCode.AccountNotActive, "Account is not actived.");

            // Trả về thông tin tuỳ theo role
            switch (account.Role)
            {
                case "Manager":
                    var manager = await _context.Managers
                        .Include(m => m.Account)
                        .FirstOrDefaultAsync(m => m.AccountId == account.Id)
                        ?? throw new Exception("Manager not found.");

                    return new GetAccountDTO
                    {
                        Id = account.Id,
                        UserId = manager.Id,
                        Email = account.Email,
                        Role = account.Role,
                        Department = manager.Department,
                        FirstName = manager.FirstName,
                        LastName = manager.LastName,
                        DateOfBirth = manager.DateOfBirth,
                        CurrentBalance = manager.CurrentBalance
                    };

                case "Trainer":
                    var trainer = await _context.Trainers
                        .Include(t => t.Account)
                        .FirstOrDefaultAsync(t => t.AccountId == account.Id)
                        ?? throw new Exception("Trainer not found.");

                    return new GetAccountDTO
                    {
                        Id = account.Id,
                        UserId = trainer.Id,
                        Email = account.Email,
                        Role = account.Role,
                        Specialization = trainer.Specialization,
                        FirstName = trainer.FirstName,
                        LastName = trainer.LastName,
                        DateOfBirth = trainer.DateOfBirth,
                        CurrentBalance = trainer.CurrentBalance
                    };

                case "Admin":
                    var admin = await _context.Admins
                        .Include(a => a.Account)
                        .FirstOrDefaultAsync(a => a.AccountId == account.Id)
                        ?? throw new Exception("Admin not found.");

                    return new GetAccountDTO
                    {
                        Id = account.Id,
                        UserId = admin.Id,
                        Email = account.Email,
                        Role = account.Role,
                        FirstName = admin.FirstName,
                        LastName = admin.LastName,
                        DateOfBirth = admin.DateOfBirth,
                        CurrentBalance = admin.CurrentBalance
                    };

                case "Member":
                    var member = await _context.Members
                        .Include(m => m.Account)
                        .FirstOrDefaultAsync(m => m.AccountId == account.Id)
                        ?? throw new Exception("Member not found.");

                    return new GetAccountDTO
                    {
                        Id = account.Id,
                        UserId = member.Id,
                        Email = account.Email,
                        Role = account.Role,
                        FirstName = member.FirstName,
                        LastName = member.LastName,
                        DateOfBirth = member.DateOfBirth,
                        CurrentBalance = member.CurrentBalance
                    };
                default:
                    throw new Exception("Unknown role.");
            }
        }

        public async Task Register(RegisterDTO registerDTO, RoleCode role)
        {
            // Kiểm tra xem tài khoản đã tồn tại chưa
            if (await _context.Accounts.AnyAsync(a => a.Email == registerDTO.Email))
            {
                throw new AuthException(AuthErrorCode.AccountAlreadyExist, "Account already exist.");
            }

            // Tạo account
            var account = new AccountModel
            {
                Id = Guid.NewGuid(),
                Email = registerDTO.Email,
                IsActivated = false,
                Role = role.ToString(),
                Password = _bcryptService.HashPassword(registerDTO.Password),
            };

            // Tạo user phù hợp với role
            UserBaseModel user;
            switch (role)
            {
                case RoleCode.Admin:
                    user = new AdminModel
                    {
                        Id = Guid.NewGuid(),
                        AccountId = account.Id,
                        CurrentBalance = 0,
                        FirstName = registerDTO.FirstName, // Phải có vì là required
                        LastName = registerDTO.LastName, // Phải có vì là required
                        DateOfBirth = registerDTO.DateOfBirth.ToDateTime(TimeOnly.MinValue)
                    };
                    _context.Admins.Add((AdminModel)user);
                    break;
                case RoleCode.Manager:
                    if (registerDTO.Department == null)
                        throw new AuthException(AuthErrorCode.InvalidDepartment, "Department is not valid.");
                    var departmentCode = (DepartmentCode)registerDTO.Department;
                    var department = departmentCode.ToString();
                    user = new ManagerModel
                    {
                        Id = Guid.NewGuid(),
                        AccountId = account.Id,
                        CurrentBalance = 0,
                        Department = department, // Phải có vì là required
                        FirstName = registerDTO.FirstName, // Phải có vì là required
                        LastName = registerDTO.LastName, // Phải có vì là required
                        DateOfBirth = registerDTO.DateOfBirth.ToDateTime(TimeOnly.MinValue)
                    };
                    _context.Managers.Add((ManagerModel)user);
                    break;
                case RoleCode.Trainer:
                    if (registerDTO.Specialization == null)
                        throw new AuthException(AuthErrorCode.InvalidSpecialization, "Specialization is not valid.");
                    var specializationCode = (SpecializationCode)registerDTO.Specialization;
                    var specialization = specializationCode.ToString();
                    user = new TrainerModel
                    {
                        Id = Guid.NewGuid(),
                        AccountId = account.Id,
                        CurrentBalance = 0,
                        Specialization = specialization, // Phải có vì là required
                        FirstName = registerDTO.FirstName, // Phải có vì là required
                        LastName = registerDTO.LastName, // Phải có vì là required
                        DateOfBirth = registerDTO.DateOfBirth.ToDateTime(TimeOnly.MinValue)
                    };
                    _context.Trainers.Add((TrainerModel)user);
                    break;
                case RoleCode.Member:
                default:
                    user = new MemberModel
                    {
                        Id = Guid.NewGuid(),
                        AccountId = account.Id,
                        CurrentBalance = 0,
                        FirstName = registerDTO.FirstName, // Phải có vì là required
                        LastName = registerDTO.LastName, // Phải có vì là required
                        DateOfBirth = registerDTO.DateOfBirth.ToDateTime(TimeOnly.MinValue)
                    };
                    _context.Members.Add((MemberModel)user);
                    break;
            }

            account.UserId = user.Id;
            _context.Accounts.Add(account);

            await _context.SaveChangesAsync();
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
        public async Task<GetAccountDTO?> GetUser(Guid accountId)
        {
            var account = await _context.Accounts.FirstOrDefaultAsync(a => a.Id == accountId)
                ?? throw new AuthException(AuthErrorCode.AccountNotExist, "Account does not exist.");

            UserBaseModel? user = account.Role switch
            {
                "Admin" => await _context.Admins.FirstOrDefaultAsync(a => a.AccountId == accountId),
                "Manager" => await _context.Managers.FirstOrDefaultAsync(a => a.AccountId == accountId),
                "Trainer" => await _context.Trainers.FirstOrDefaultAsync(a => a.AccountId == accountId),
                "Member" => await _context.Members.FirstOrDefaultAsync(a => a.AccountId == accountId),
                _ => null
            };

            if (user == null)
                throw new AuthException(AuthErrorCode.AccountNotExist, "User associated with this account does not exist.");

            // Map the user and account to GetAccountDTO
            return new GetAccountDTO
            {
                Id = account.Id,
                UserId = user.Id,
                Email = account.Email,
                Role = account.Role,
                FirstName = user.FirstName,
                LastName = user.LastName,
                DateOfBirth = (DateTime)user.DateOfBirth,
                CurrentBalance = user.CurrentBalance,
                // Add role-specific properties if needed
                Department = account.Role == "Manager" ? ((ManagerModel)user).Department : null,
                Specialization = account.Role == "Trainer" ? ((TrainerModel)user).Specialization : null
            };
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
}