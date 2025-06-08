using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Moq;
using NUnit.Framework;
using Server.Controllers;
using Server.DTOs.Course;
using Server.Interfaces.IServices;
using Server.Models.Course;
using Server.Models.Room;
using Server.Models.User;
using TestProject1.DTO;
using TestProject1.Helper;

namespace Server.Tests.Controllers
{
    [TestFixture]
    public class CourseControllerTest
    {
        private Mock<ICourseService> _mockCourseService;
        private CourseController _controller;

        [SetUp]
        public void Setup()
        {
            _mockCourseService = new Mock<ICourseService>();
            _controller = new CourseController(_mockCourseService.Object);
        }

        [Test]
        public async Task GetAllCourses_ReturnsOkResult_WithListOfCourses()
        {
            var course1 = TestDataSeeder.SeedCourse();
            var course2 = TestDataSeeder.SeedCourse();
            // Arrange
            var fakeCourses = new List<CourseModel>
            {
            };
            fakeCourses.Add(course1);
            fakeCourses.Add(course2);
            _mockCourseService.Setup(service => service.GetCoursesAsync())
                .ReturnsAsync(fakeCourses);

            // Act
            var result = await _controller.GetAllCourses();

            // Assert
            Assert.IsInstanceOf<OkObjectResult>(result);

            var okResult = (OkObjectResult)result;
            Assert.IsInstanceOf<IEnumerable<CourseModel>>(okResult.Value);

            var courses = (IEnumerable<CourseModel>)okResult.Value;
            Assert.AreEqual(2, new List<CourseModel>(courses).Count);
        }

        [Test]
        public async Task GetCourseById_ReturnsNotFound_WhenCourseDoesNotExist()
        {
            // Arrange
            var fakeId = Guid.NewGuid();
            _mockCourseService.Setup(service => service.GetCourseByIdAsync(fakeId))
                .ReturnsAsync((CourseModel)null);

            // Act
            var result = await _controller.GetCourseById(fakeId);

            // Assert
            Assert.IsInstanceOf<NotFoundObjectResult>(result);

        }

        [Test]
        public async Task GetCourseById_ReturnsOkResult_WhenCourseExists()
        {
            // Arrange
            var fakeId = Guid.NewGuid();
            var fakeCourse = TestDataSeeder.SeedCourse();
        
            _mockCourseService.Setup(service => service.GetCourseByIdAsync(fakeCourse.Id))
                .ReturnsAsync(fakeCourse);
        
            // Act
            var result = await _controller.GetCourseById(fakeCourse.Id);
        
            // Assert
            Assert.IsInstanceOf<OkObjectResult>(result);
        
            var okResult = (OkObjectResult)result;
            Assert.IsInstanceOf<CourseModel>(okResult.Value);
        
            var course = (CourseModel)okResult.Value;
            Assert.AreEqual(fakeCourse.Id, course.Id);
        }
    }
}