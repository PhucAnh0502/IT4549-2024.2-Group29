using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.DTOs.User;
using Server.Interfaces.IServices;


namespace Server.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var id = User.FindFirst("accountId")?.Value;
            if (!Guid.TryParse(id, out var accountId))
                return BadRequest(new { message = "Invalid user identifier" });
            var profile = await _userService.GetProfileAsync(accountId);
            return Ok(profile);
        }

        [HttpPost("update-profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDTO model)
        {
            var id = User.FindFirst("userId")?.Value;
            if (!Guid.TryParse(id, out var userId))
                return BadRequest(new { message = "Invalid user identifier" });
            await _userService.UpdateProfileAsync(userId, model);
            return Ok(new { message = "Update profile successful" });
        }


        //need to be authorized
        [Authorize(Roles = "Admin, Manager")]
        [HttpGet("all-user")]
        public async Task<IActionResult> GetAllUser()
        {   
            var department = User.FindFirst("department")?.Value;
            if(department == null || department == "HR")
            {
                var users = await _userService.GetUsersAsync();
                return Ok(users);

            }
            return Forbid();
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("all-account")]
        public async Task<IActionResult> GetAllAccount()
        {
            var accounts = await _userService.GetAccountsAsync();
            return Ok(accounts);
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserById(Guid userId)
        {
            var user = await _userService.GetUserAsync(userId);
            if (user == null)
                return NotFound(new { message = "User not found" });
            return Ok(user);
        }

        [HttpGet("user-for-hr/{userId}")]
        [Authorize(Roles = "Admin, Manager")]
        public async Task<IActionResult> GetUserForHR(Guid userId)
        {
            var department = User.FindFirst("department")?.Value;
            if (department == null || department == "HR")
            {
                var user = await _userService.GetUserAsyncForHR(userId);
                if (user == null)
                    return NotFound(new { message = "User not found" });
                return Ok(user);
            }
            return Forbid();
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("delete/{userId}")]
        public async Task<IActionResult> DeleteUser(Guid userId)
        {
            await _userService.DeleteUserAsync(userId);
            return Ok(new { message = "Delete user successful" });
        }

        [HttpPut("deposit")]
        public async Task<IActionResult> Deposit([FromBody] DepositDTO model)
        {
            var id = User.FindFirst("userId")?.Value;
            if (!Guid.TryParse(id, out var userId))
                return BadRequest(new { message = "Invalid user identifier" });
            await _userService.DepositAsync(userId, model);
            return Ok(new { message = "Deposit successful" });
        }
    }
}