using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using NUnit.Framework;
using Server.Controllers;
using Server.DTOs.Report;
using Server.Enums;
using Server.Interfaces.IServices;
using Server.Models.Report;
using TestProject1.Helper;

namespace Server.Tests.Controllers
{
    [TestFixture]
    public class ReportControllerTest
    {
        private Mock<IReportService> _mockReportService;
        private ReportController _controller;

        [SetUp]
        public void Setup()
        {
            _mockReportService = new Mock<IReportService>();
            _controller = new ReportController(_mockReportService.Object);

            // Setup user với các claim mặc định có thể thay đổi trong test cụ thể
            var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
                new Claim("userId", Guid.NewGuid().ToString()),
                new Claim("role", "Admin"),
                new Claim("department", "Support")
            }, "mock"));

            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = user }
            };
        }
        
        [Test]
        public async Task CreateReport_ReturnsUnauthorized_WhenUserIdNotExists()
        {
            var dto = new CreateReportDTO
            {
                Title = "Title",
                Content = "Content",
                ReportType = ReportTypeCode.Equipment,
            };

            // Setup user không có userId claim
            var userWithoutId = new ClaimsPrincipal(new ClaimsIdentity());
            _controller.ControllerContext.HttpContext.User = userWithoutId;

            var result = await _controller.CreateReport(dto);

            Assert.IsInstanceOf<UnauthorizedResult>(result);
        }


        [Test]
        public async Task CreateReport_ReturnsNull_WhenUserIdNotExists()
        {
            var userId = Guid.NewGuid();
            
            var dto = new CreateReportDTO
            {
                Title = "Title",
                Content = "Content",
                ReportType = ReportTypeCode.Equipment,
            }; // Khởi tạo dữ liệu phù hợp

            // Update userId claim cho phù hợp
            var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
                new Claim("userId", userId.ToString()),
                new Claim("role", "Member"),
                new Claim("department", "Support")
            }));

            _controller.ControllerContext.HttpContext.User = user;

            _mockReportService.Setup(s => s.CreateReportAsync(userId, dto))
                .Returns(Task.CompletedTask);

            var result = await _controller.CreateReport(dto);

            Assert.IsInstanceOf<OkObjectResult>(result);
        }

        [Test]
        public async Task GetReportById_ReturnsForbid_WhenRoleManagerNotSupport()
        {
            var reportId = Guid.NewGuid();
            
            var user = TestDataSeeder.SeedUser();
            var report = new ReportModel()
            {
                Id = reportId,
                Title = "Title",
                Content = "Content",
                ReportType = "hihihaha",
                Status = "Pending",
                CreatedAt = DateTime.Now,
                CreatedBy = user.Id,
                CreatedByUser = user,
            };

            _mockReportService.Setup(s => s.GetReportByIdAsync(reportId))
                .ReturnsAsync(report);

            var result = await _controller.GetReportById(reportId);

            Assert.IsInstanceOf<OkObjectResult>(result);
        }

        [Test]
        public async Task GetReportById_ReturnsOk_WhenUserIsCreator()
        {
            var userId = Guid.NewGuid();
            var reportId = Guid.NewGuid();
        
            var user = TestDataSeeder.SeedUser();
        
            var report = new ReportModel()
            {
                Id = reportId,
                Title = "Title",
                Content = "Content",
                ReportType = "hihihaha",
                Status = "Pending",
                CreatedAt = DateTime.Now,
                CreatedBy = user.Id,
                CreatedByUser = user,
            };
        
            _mockReportService.Setup(s => s.GetReportByIdAsync(reportId))
                .ReturnsAsync(report);
        
            var result = await _controller.GetReportById(reportId);
        
            Assert.IsInstanceOf<OkObjectResult>(result);
            var okResult = (OkObjectResult)result;
            Assert.AreEqual(report, okResult.Value);
        }
    
        
    }
}
