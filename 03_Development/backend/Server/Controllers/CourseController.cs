using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.DTOs.Course;
using Server.Interfaces.IServices;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CourseController : ControllerBase
    {
        private readonly ICourseService _courseService;
        public CourseController(ICourseService courseService)
        {
            _courseService = courseService;
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllCourses()
        {
            var courses = await _courseService.GetCoursesAsync();
            return Ok(courses);

        }

        [HttpGet("{courseId}")]
        public async Task<IActionResult> GetCourseById(Guid courseId)
        {

            var course = await _courseService.GetCourseByIdAsync(courseId);
            if (course == null)
                return NotFound(new { message = "Course not found" });
            return Ok(course);

        }

        [HttpGet("trainer/{trainerId}")]
        public async Task<IActionResult> GetCoursesByTrainerId(Guid trainerId)
        {

            var courses = await _courseService.GetCoursesByTrainerIdAsync(trainerId);
            return Ok(courses);

        }

        [HttpGet("member/{memberId}")]
        public async Task<IActionResult> GetRegisteredCoursesByMemberId(Guid memberId)
        {
            var id = User.FindFirst("userId")?.Value;
            var role = User.FindFirst("role")?.Value;
            var department = User.FindFirst("department")?.Value;
            if (role == "Manager" && department != "Support")
            {
                return Forbid();
            }
            if (role == "Member")
            {
                if (id != memberId.ToString())
                {
                    return Forbid();
                }
            }
            var courses = await _courseService.GetCoursesByMemberIdAsync(memberId);
            return Ok(courses);
        }

        [HttpGet("room/{roomId}")]
        public async Task<IActionResult> GetCoursesByRoomId(Guid roomId)
        {
            var courses = await _courseService.GetCoursesByRoomIdAsync(roomId);
            return Ok(courses);
        }

        [HttpGet("type/{type}")]
        public async Task<IActionResult> GetCoursesByType(string type)
        {

            var courses = await _courseService.GetCoursesByTypeAsync(type);
            return Ok(courses);

        }

        [HttpGet("status/{status}")]
        public async Task<IActionResult> GetCoursesByStatus(string status)
        {

            var courses = await _courseService.GetCoursesByStatusAsync(status);
            return Ok(courses);

        }

        [HttpGet("date-range")]
        public async Task<IActionResult> GetCoursesByDateRange(DateTime startDate, DateTime endDate)
        {

            var courses = await _courseService.GetCoursesByDateRangeAsync(startDate, endDate);
            return Ok(courses);

        }

        [HttpGet("price-range")]
        public async Task<IActionResult> GetCoursesByPriceRange(float minPrice, float maxPrice)
        {

            var courses = await _courseService.GetCoursesByPriceRangeAsync(minPrice, maxPrice);
            return Ok(courses);

        }

        [HttpGet("name/{name}")]
        public async Task<IActionResult> GetCoursesByName(string name)
        {

            var courses = await _courseService.GetCoursesByNameAsync(name);
            return Ok(courses);

        }

        [HttpPost("create")]
        [Authorize(Roles = "Trainer")]
        public async Task<IActionResult> CreateCourse([FromBody] CreateCourseDTO createCourseDTO)
        {

            var trainerId = User.FindFirst("userId")?.Value;
            if (trainerId == null)
                return BadRequest(new { message = "Trainer ID not found" });

            await _courseService.CreateCourseAsync(createCourseDTO, Guid.Parse(trainerId));
            return Ok(new { message = "Course created successfully" });

        }

        [HttpDelete("{courseId}")]
        [Authorize(Roles = "Admin, Trainer")]
        public async Task<IActionResult> DeleteCourse(Guid courseId)
        {

            await _courseService.DeleteCourseAsync(courseId);
            return Ok(new { message = "Course deleted successfully" });

        }

        [HttpPost("register/{courseId}")]
        [Authorize(Roles = "Member")]
        public async Task<IActionResult> RegisterCourse(Guid courseId)
        {

            var memberId = User.FindFirst("userId")?.Value;
            if (memberId == null)
                return BadRequest(new { message = "Member ID not found" });

            await _courseService.RegisterForCourseAsync(courseId, Guid.Parse(memberId));
            return Ok(new { message = "Course registered successfully" });

        }

        [HttpGet("registered")]
        public async Task<IActionResult> GetRegisteredCourses()
        {

            var memberId = User.FindFirst("userId")?.Value;
            if (memberId == null)
                return BadRequest(new { message = "Member ID not found" });

            var registeredCourses = await _courseService.GetRegisteredCoursesAsync(Guid.Parse(memberId));
            return Ok(registeredCourses);

        }

        [HttpPost("unregister/{courseId}")]
        public async Task<IActionResult> UnregisterCourse(Guid courseId)
        {

            var memberId = User.FindFirst("userId")?.Value;
            if (memberId == null)
                return BadRequest(new { message = "Member ID not found" });

            await _courseService.UnregisterFromCourseAsync(courseId, Guid.Parse(memberId));
            return Ok(new { message = "Course unregistered successfully" });

        }
    }
}