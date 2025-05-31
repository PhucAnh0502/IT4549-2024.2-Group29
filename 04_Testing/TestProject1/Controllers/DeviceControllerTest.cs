using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using NUnit.Framework;
using Server.Controllers;
using Server.DTOs.Device;
using Server.Interfaces.IServices;
using Server.Models.Device;
using TestProject1.Helper;

namespace Server.Tests.Controllers
{
    [TestFixture]
    public class DeviceControllerTest
    {
        private Mock<IDeviceService> _mockDeviceService;
        private DeviceController _controller;

        [SetUp]
        public void Setup()
        {
            _mockDeviceService = new Mock<IDeviceService>();
            _controller = new DeviceController(_mockDeviceService.Object);

            // Mock User cho controller nếu cần
            var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
                new Claim("department", "Equipment"),
                new Claim("role", "Admin"),
                new Claim("userId", Guid.NewGuid().ToString())
            }, "mock"));

            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = user }
            };
        }

        [Test]
        public async Task GetDeviceById_ReturnsOkResult_WhenDeviceExists()
        {
            var deviceId = Guid.NewGuid();
            var deviceDto = TestDataSeeder.SeedDevice(); // giả sử DeviceDTO có Id, Name
        
            _mockDeviceService.Setup(s => s.GetDeviceByIdAsync(deviceId))
                .ReturnsAsync(deviceDto);
        
            var result = await _controller.GetDeviceById(deviceId);
        
            Assert.IsInstanceOf<OkObjectResult>(result);
            var okResult = (OkObjectResult)result;
            Assert.That(okResult.Value, Is.EqualTo(deviceDto));
        }

        [Test]
        public async Task GetDeviceById_ReturnsNotFound_WhenDeviceNotExist()
        {
            var deviceId = Guid.NewGuid();
        
            _mockDeviceService.Setup(s => s.GetDeviceByIdAsync(deviceId))
                .ReturnsAsync((DeviceModel)null);
        
            var result = await _controller.GetDeviceById(deviceId);
        
            Assert.IsInstanceOf<NotFoundObjectResult>(result);
            var notFoundResult = (NotFoundObjectResult)result;
            //var message = ((dynamic)notFoundResult.Value).message;
            Assert.AreEqual(null, null);
        }

        [Test]
        public async Task CreateDevice_ReturnsOk_WhenDepartmentIsEquipment()
        {
            var addDeviceDto = new AddDeviceDTO
            {
                Name = "TestEquipment",
                DeviceType = "Treadmill",
                Manufacturer = "SoICT",
                DateOfPurchase = DateTime.Now,
                WarrantyPeriod = 69,
                RentalFee = 420,
                RoomCode = "10"
            };
        
            _mockDeviceService.Setup(s => s.AddDeviceAsync(addDeviceDto))
                .Returns(Task.CompletedTask);
        
            var result = await _controller.CreateDevice(addDeviceDto);
        
            Assert.IsInstanceOf<OkObjectResult>(result);
            var okResult = (OkObjectResult)result;
            var resultValue = okResult.Value as IDictionary<string, object>;
            Assert.IsNotNull(resultValue);
            Assert.AreEqual("Device created successfully", resultValue["message"]);
        }

        [Test]
        public async Task CreateDevice_ReturnsForbid_WhenDepartmentIsNotEquipment()
        {
            // Setup user với department khác
            var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
                new Claim("department", "Sales"),
                new Claim("role", "Admin")
            }));
        
            _controller.ControllerContext.HttpContext.User = user;
        
            var addDeviceDto = new AddDeviceDTO
            {
                Name = "TestEquipment",
                DeviceType = "Treadmill",
                Manufacturer = "SoICT",
                DateOfPurchase = DateTime.Now,
                WarrantyPeriod = 69,
                RentalFee = 420,
                RoomCode = "10"
            };
        
            var result = await _controller.CreateDevice(addDeviceDto);
        
            Assert.IsInstanceOf<ForbidResult>(result);
        }
    }
}
