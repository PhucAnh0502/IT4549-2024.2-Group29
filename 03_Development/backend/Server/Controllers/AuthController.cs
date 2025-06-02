using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.DTOs.Auth;
using Server.Enums.Auth;
using Server.Interfaces.IServices;
using Server.Interfaces.IUltilities;
using Server.Utils;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IJwtUtils _jwtUtils;
        private readonly IActivationService _activationService;
        private readonly IPasswordService _passwordService;
        public AuthController(IAuthService authService, IJwtUtils jwtUtils, IActivationService activationService, IPasswordService passwordService)
        {
            _authService = authService;
            _jwtUtils = jwtUtils;
            _activationService = activationService;
            _passwordService = passwordService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO loginInfor)
        {
            var account = await _authService.Login(loginInfor.Email, loginInfor.Password);
            var user = await _authService.GetUser(account.Id);

            if (user == null)
                return BadRequest(new { message = "User not found" });

            string? department = null;
            string? specialization = null;

            if (account.Role == "Manager")
                department = user.Department;

            if (account.Role == "Trainer")
                specialization = user.Specialization;

            var token = _jwtUtils.GenerateToken(account.Id, account.Role, user.UserId, department, specialization);

            return Ok(new { token, account });
        }


        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDTO registerInfor)
        {

            RoleCode role = (RoleCode)registerInfor.Role;
            await _authService.Register(registerInfor, role);
            return Ok(new { message = "Register successful" });

        }

        [HttpPost("request-active")]
        public async Task<IActionResult> RequestActive([FromBody] RequestActiveDTO requestActiveInfor)
        {
            var activeCode = await _activationService.GetActiveCode(requestActiveInfor.Email, requestActiveInfor.Password);
            return Ok(new { activeCode });

        }

        [HttpPost("activate-account")]
        public async Task<IActionResult> ActivateAccount([FromBody] ActiveAccountDTO activateAccountInfor)
        {
            await _activationService.ActivateAccount(activateAccountInfor.ActiveCode);
            return Ok(new { message = "Account activated successfully" });
        }

        [Authorize]
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] UpdateDTO changePasswordInfor)
        {
            var id = User.FindFirst("accountId")?.Value;
            if (!Guid.TryParse(id, out var accountId))
                return BadRequest(new { message = "Invalid user identifier" });

            await _passwordService.ChangePassword(accountId, changePasswordInfor.OldPassword, changePasswordInfor.NewPassword);
            return Ok(new { message = "Password changed successfully" });
        }

        [HttpPost("request-forgot-password")]
        public async Task<IActionResult> RequestForgotPassword([FromBody] RequestResetDTO requestResetInfor)
        {
            var email = requestResetInfor.Email;
            var resetCode = await _passwordService.RequestForgotPassword(email);
            return Ok(new { resetCode });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDTO resetPasswordInfor)
        {
            await _passwordService.ResetPassword(resetPasswordInfor.NewPassword, resetPasswordInfor.ConfirmPassword, resetPasswordInfor.ResetCode);
            return Ok(new { message = "Password reset successfully" });
        }
    }
}
