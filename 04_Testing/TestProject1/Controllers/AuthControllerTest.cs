using System.Security.Claims;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Server.Controllers;
using Server.DTOs.Auth;
using Server.Enums.Auth;
using Server.Interfaces.IServices;
using Server.Interfaces.IUltilities;
using Server.Models.Account;
using Server.Models.User;

namespace TestProject1.Controllers;

public class AuthControllerTest
{
    private Mock<IAuthService> _authServiceMock;
    private Mock<IJwtUtils> _jwtUtilsMock;
    private Mock<IActivationService> _activationServiceMock;
    private AuthController _controller;
    
    [SetUp]
    public void SetUp()
    {
        _authServiceMock = new Mock<IAuthService>();
        _jwtUtilsMock = new Mock<IJwtUtils>();
        _controller = new AuthController(_authServiceMock.Object, _jwtUtilsMock.Object, _activationServiceMock.Object);
    }
    
    
     [Test]
    public async Task Login_ReturnsOk_WithTokenAndAccount()
    {
        // Arrange
        var loginDto = new LoginDTO
        {
            Email = "admin01@gymcenter.com",
            Password = "123456"
        };

        var fakeAccount = new AccountModel()
        {
            Id = Guid.NewGuid(),
            Email = "admin01@gymcenter.com",
            Password = "123456",
            IsActivated = true,
            Role = "Trainer",
            UserId = Guid.NewGuid(),
        };

        var fakeUser = new UserBaseModel()
        {
            Id = fakeAccount.UserId,
            FirstName = "Sigma",
            LastName = "Doe",
            DateOfBirth = DateTime.Now,
            AccountId = fakeAccount.Id
        };

        var getAccountDTO = new GetAccountDTO()
        {
            Email = fakeAccount.Email,
            Role = fakeAccount.Role,
        };
        _authServiceMock.Setup(x => x.Login(loginDto.Email, loginDto.Password))
            .ReturnsAsync(getAccountDTO);

        _authServiceMock.Setup(x => x.GetUser(fakeAccount.Id))
            .ReturnsAsync(getAccountDTO);


        _jwtUtilsMock.Setup(x => x.GenerateToken(
                fakeAccount.Id, fakeAccount.Role, fakeUser.AccountId, null, null))
            .Returns("fake-jwt");

        // Act
        var result = await _controller.Login(loginDto);
        Console.WriteLine(result); // Xem thực chất là gì


        // Assert
        result.Should().BeOfType<OkObjectResult>();
        var okResult = result as OkObjectResult;
        okResult!.Value.Should().NotBeNull();


        dynamic? body = okResult!.Value;
        string token = body.token;
        object account = body.account;

        token.Should().Be("fake-jwt");
        account.Should().BeEquivalentTo(fakeAccount);
    }
    
    // [Test]
    // public async Task Register_ReturnsOk_WhenSuccessful()
    // {
    //     var dto = new RegisterDTO { Email = "test@example.com", Role = (int)RoleCode.Manager };
    //
    //     _authServiceMock.Setup(x => x.Register(dto, RoleCode.Manager))
    //         .Returns(Task.CompletedTask);
    //
    //     var result = await _controller.Register(dto);
    //
    //     result.Should().BeOfType<OkObjectResult>();
    //     ((OkObjectResult)result).Value.Should().BeEquivalentTo(new { message = "Register successful" });
    // }
    
    [Test]
    public async Task RequestActive_ReturnsActiveCode()
    {
        var dto = new RequestActiveDTO { Email = "test@example.com", Password = "pass" };
        _activationServiceMock.Setup(x => x.GetActiveCode(dto.Email, dto.Password))
            .ReturnsAsync("ABC123");

        var result = await _controller.RequestActive(dto);

        result.Should().BeOfType<OkObjectResult>();
        dynamic value = ((OkObjectResult)result).Value!;
        ((string)value.activeCode).Should().Be("ABC123");
    }
    
    [Test]
    public async Task ActivateAccount_ReturnsOk_WhenSuccessful()
    {
        var dto = new ActiveAccountDTO { ActiveCode = "ABC123" };

        _activationServiceMock.Setup(x => x.ActivateAccount(dto.ActiveCode))
            .Returns(Task.CompletedTask);

        var result = await _controller.ActivateAccount(dto);

        result.Should().BeOfType<OkObjectResult>();
        ((OkObjectResult)result).Value.Should().BeEquivalentTo(new { message = "Account activated successfully" });
    }

    [Test]
    public async Task ChangePassword_ReturnsOk_WhenSuccessful()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var dto = new UpdateDTO() { OldPassword = "old", NewPassword = "new", ConfirmPassword = "new"};

        var claims = new ClaimsPrincipal(new ClaimsIdentity(new[]
        {
            new Claim("accountId", userId.ToString())
        }));

        _controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = claims }
        };

        _authServiceMock.Setup(x => x.ChangePassword(userId, dto.OldPassword, dto.NewPassword))
            .Returns(Task.CompletedTask);

        var result = await _controller.ChangePassword(dto);

        result.Should().BeOfType<OkObjectResult>();
        ((OkObjectResult)result).Value.Should().BeEquivalentTo(new { message = "Password changed successfully" });
    }
    
    [Test]
    public async Task RequestForgotPassword_ReturnsResetCode()
    {
        var dto = new RequestResetDTO { Email = "test@example.com" };

        _authServiceMock.Setup(x => x.RequestForgotPassword(dto.Email))
            .ReturnsAsync("RESET123");

        var result = await _controller.RequestForgotPassword(dto);

        result.Should().BeOfType<OkObjectResult>();
        dynamic value = ((OkObjectResult)result).Value!;
        ((string)value.resetCode).Should().Be("RESET123");
    }
    
    [Test]
    public async Task ResetPassword_ReturnsOk_WhenSuccessful()
    {
        var dto = new ResetPasswordDTO
        {
            NewPassword = "newpass",
            ConfirmPassword = "newpass",
            ResetCode = "RESET123"
        };

        _authServiceMock.Setup(x => x.ResetPassword(dto.NewPassword, dto.ConfirmPassword, dto.ResetCode))
            .Returns(Task.CompletedTask);

        var result = await _controller.ResetPassword(dto);

        result.Should().BeOfType<OkObjectResult>();
        ((OkObjectResult)result).Value.Should().BeEquivalentTo(new { message = "Password reset successfully" });
    }
}