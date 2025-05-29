using Server.Models.Account;
using Server.Interfaces.IServices;
using Server.Data;
using Server.DTOs.User;
using Server.Models.User;
using Server.Middlewares;
using Server.Enums.ErrorCodes;
using Microsoft.EntityFrameworkCore;

namespace Server.Services
{
    public class UserService(DatabaseContext context) : IUserService
    {
        private readonly DatabaseContext _context = context;

        public async Task<AccountModel?> GetAccountAsync(Guid accountId)
        {
            var account = await _context.Accounts
                            .FirstOrDefaultAsync(a => a.Id == accountId);
            return account ?? throw new UserException(UserErrorCode.AccountNotFound, "Account not found.");
        }

        public async Task<List<AccountModel>> GetAccountsAsync()
        {
            var accounts = await _context.Accounts
                            .ToListAsync();
            return accounts ?? throw new UserException(UserErrorCode.UnknownError, "Unknown error.");
        }

        public async Task<GetProfileDTO> GetProfileAsync(Guid accountId)
        {
            var account = await _context.Accounts
                            .FirstOrDefaultAsync(a => a.Id == accountId) ?? throw new UserException(UserErrorCode.AccountNotFound, "Account not found.");

            // Với TPT, chúng ta có thể truy vấn từ bảng cơ sở trước, rồi tải thêm thông tin chi tiết dựa vào loại
            var baseUser = await _context.Users
                            .FirstOrDefaultAsync(u => u.AccountId == accountId) ?? throw new UserException(UserErrorCode.UserNotFound, "User not found.");

            if (account.Role == "Member")
            {
                var member = await _context.Members
                                .FirstOrDefaultAsync(m => m.Id == baseUser.Id) ?? throw new UserException(UserErrorCode.UserNotFound, "Member user not found.");
                return new GetProfileDTO
                {
                    Email = account.Email,
                    Role = account.Role,
                    FirstName = member.FirstName ?? string.Empty,
                    LastName = member.LastName ?? string.Empty,
                    DateOfBirth = member.DateOfBirth,
                    Specialization = "None",
                    Department = "None",
                    CurrentBalance = member.CurrentBalance,
                };
            }
            else if (account.Role == "Trainer")
            {
                var trainer = await _context.Trainers
                                .FirstOrDefaultAsync(t => t.Id == baseUser.Id) ?? throw new UserException(UserErrorCode.UserNotFound, "Trainer user not found.");
                return new GetProfileDTO
                {
                    Email = account.Email,
                    Role = account.Role,
                    FirstName = trainer.FirstName ?? string.Empty,
                    LastName = trainer.LastName ?? string.Empty,
                    DateOfBirth = trainer.DateOfBirth,
                    Specialization = trainer.Specialization,
                    Department = "None",
                    CurrentBalance = trainer.CurrentBalance,
                };
            }
            else if (account.Role == "Admin")
            {
                var admin = await _context.Admins
                                .FirstOrDefaultAsync(a => a.Id == baseUser.Id) ?? throw new UserException(UserErrorCode.UserNotFound, "Admin user not found.");
                return new GetProfileDTO
                {
                    Email = account.Email,
                    Role = account.Role,
                    FirstName = admin.FirstName ?? string.Empty,
                    LastName = admin.LastName ?? string.Empty,
                    DateOfBirth = admin.DateOfBirth,
                    Specialization = "None",
                    Department = "None",
                    CurrentBalance = admin.CurrentBalance,
                };
            }
            else if (account.Role == "Manager")
            {
                var manager = await _context.Managers
                                .FirstOrDefaultAsync(m => m.Id == baseUser.Id) ?? throw new UserException(UserErrorCode.UserNotFound, "Manager user not found.");
                return new GetProfileDTO
                {
                    Email = account.Email,
                    Role = account.Role,
                    FirstName = manager.FirstName ?? string.Empty,
                    LastName = manager.LastName ?? string.Empty,
                    DateOfBirth = manager.DateOfBirth,
                    Specialization = "None",
                    Department = manager.Department,
                    CurrentBalance = manager.CurrentBalance,
                };
            }
            else
            {
                throw new UserException(UserErrorCode.UnknownError, "Unknown error.");
            }
        }

        public async Task<List<UserBaseModel>> GetUsersAsync()
        {
            var users = await _context.Users
                        .Include(u => u.Account)
                        .ToListAsync();
            return users ?? throw new UserException(UserErrorCode.UnknownError, "Unknown error.");
        }

        public async Task UpdateProfileAsync(Guid userId, UpdateProfileDTO model)
        {
            var user = await _context.Users.FirstOrDefaultAsync(m => m.Id == userId) ?? throw new UserException(UserErrorCode.UserNotFound, "User not found.");

            // Tìm kiếm đúng loại user và cập nhật
            if (user != null)
            {
                if (!string.IsNullOrEmpty(model.FirstName ?? string.Empty))
                    user.FirstName = model.FirstName ?? string.Empty;

                if (!string.IsNullOrEmpty(model.LastName ?? string.Empty))
                    user.LastName = model.LastName ?? string.Empty;

                if (model.DateOfBirth != null && model.DateOfBirth != default)
                    user.DateOfBirth = (DateTime)model.DateOfBirth;

                // Xử lý các thuộc tính đặc biệt của từng loại user
                var account = await _context.Accounts.FirstOrDefaultAsync(a => a.Id == user.AccountId);
                if (account != null)
                {
                    if (account.Role == "Manager")
                    {
                        var manager = await _context.Managers.FirstOrDefaultAsync(m => m.Id == user.Id);
                        if (manager != null && !string.IsNullOrEmpty(model.Department))
                        {
                            manager.Department = model.Department;
                        }
                    }
                    else if (account.Role == "Trainer")
                    {
                        var trainer = await _context.Trainers.FirstOrDefaultAsync(t => t.Id == user.Id);
                        if (trainer != null && !string.IsNullOrEmpty(model.Specialization))
                        {
                            trainer.Specialization = model.Specialization;
                        }
                    }
                }

                await _context.SaveChangesAsync();
            }
        }

        public async Task DeleteUserAsync(Guid userId)
        {
            var user = await _context.Users.FirstOrDefaultAsync(m => m.Id == userId) ?? throw new UserException(UserErrorCode.UserNotFound, "User not found.");

            // Trong Table Per Type, việc xóa từ bảng gốc sẽ cascade đến các bảng con
            _context.Users.Remove(user);

            // Xóa tài khoản liên quan
            var account = await _context.Accounts.FindAsync(user.AccountId);
            if (account != null)
                _context.Accounts.Remove(account);

            await _context.SaveChangesAsync();
        }

        public async Task DepositAsync(Guid userId, DepositDTO model)
        {
            var user = await _context.Users.FirstOrDefaultAsync(m => m.Id == userId) ?? throw new UserException(UserErrorCode.UserNotFound, "User not found.");
            user.CurrentBalance += model.Amount;
            await _context.SaveChangesAsync();
        }

        public async Task<UserBaseModel> GetUserAsyncForHR(Guid userId)
        {
            var user = await _context.Users
                            .Include(u => u.Account)
                            .FirstOrDefaultAsync(u => u.Id == userId) ?? throw new UserException(UserErrorCode.UserNotFound, "User not found.");
            return user ?? throw new UserException(UserErrorCode.UserNotFound, "User not found.");
        }

        public async Task<UserBaseModel> GetUserAsync(Guid userId)
        {
            var user = await _context.Users
                            .FirstOrDefaultAsync(u => u.Id == userId) ?? throw new UserException(UserErrorCode.UserNotFound, "User not found.");
            return user ?? throw new UserException(UserErrorCode.UserNotFound, "User not found.");
        }

        public async Task<string?> GetTrainerSpecialization(Guid userId)
        {
            var specialization = await _context.Trainers
                            .Where(t => t.Id == userId)
                            .Select(t => t.Specialization)
                            .FirstOrDefaultAsync();
            return specialization;
        }
    }
}