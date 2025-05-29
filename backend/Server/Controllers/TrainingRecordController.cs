using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.DTOs.TrainingRecord;
using Server.Interfaces.IServices;
using Server.Models.User;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TrainingRecordController : ControllerBase
    {
        private readonly ITrainingRecordService _trainingRecordService;
        private readonly ICourseService _courseService;
        public TrainingRecordController(ITrainingRecordService trainingRecordService, ICourseService courseService)
        {
            _courseService = courseService;
            _trainingRecordService = trainingRecordService;
        }

        [HttpPost("create")]
        [Authorize(Roles = "Trainer, Manager")]
        public async Task<IActionResult> CreateTrainingRecord([FromBody] CreateTrainingRecordDTO trainingRecordDto)
        {
            var department = User.FindFirst("department")?.Value;
            if (department != null && department != "Support")
            {
                return Forbid();
            }
            if (department == null)
            {
                var userId = User.FindFirst("userId")?.Value;
                var trainer = await _courseService.GetTrainerByRegisteredCourseIdAsync(trainingRecordDto.RegisteredCourseId);
                if (userId != trainer.Id.ToString())
                {
                    return Forbid();
                }
            }
            await _trainingRecordService.CreateTrainingRecordAsync(trainingRecordDto);
            return Ok(new { message = "Training record created successfully" });
        }

        [HttpGet("all-training-records")]
        [Authorize(Roles = "Admin, Manager")]
        public async Task<IActionResult> GetAllTrainingRecords()
        {
            var department = User.FindFirst("department")?.Value;
            if (department == null || department == "Support")
            {
                var trainingRecords = await _trainingRecordService.GetAllTrainingRecordsAsync();
                return Ok(trainingRecords);
            }
            return Forbid();
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetTrainingRecordById(Guid id)
        {
            var userId = User.FindFirst("userId")?.Value;
            var role = User.FindFirst("role")?.Value;
            var department = User.FindFirst("department")?.Value;

            if (role == "Manager" && department != "Support")
                return Forbid();

            var roleAccessCheckers = new Dictionary<string, Func<Task<Guid>>>
            {
                ["Trainer"] = async () =>
                {
                    var trainer = await _courseService.GetTrainerByRegisteredCourseIdAsync(id);
                    return trainer.Id;
                },
                ["User"] = async () =>
                {
                    var member = await _courseService.GetMemberByRegisteredCourseIdAsync(id);
                    return member.Id;
                }
            };

            if (role != null && roleAccessCheckers.TryGetValue(role, out var getExpectedUserId))
            {
                var expectedId = await getExpectedUserId();
                if (userId != expectedId.ToString())
                    return Forbid();
            }

            var trainingRecord = await _trainingRecordService.GetTrainingRecordByIdAsync(id);

            return Ok(trainingRecord);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Trainer, Manager")]
        public async Task<IActionResult> UpdateTrainingRecord(Guid id, [FromBody] UpdateTrainingRecordDTO trainingRecordDto)
        {
            var userId = User.FindFirst("userId")?.Value;
            var role = User.FindFirst("role")?.Value;
            var department = User.FindFirst("department")?.Value;

            if (role == "Manager" && department != "Support")
                return Forbid();
            if (role == "Trainer")
            {
                var trainer = await _courseService.GetTrainerByRegisteredCourseIdAsync(id);
                if (userId != trainer.Id.ToString())
                    return Forbid();
            }
            await _trainingRecordService.UpdateTrainingRecordAsync(id, trainingRecordDto);
            return Ok(new { message = "Training record updated successfully" });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Trainer, Manager, Admin")]
        public async Task<IActionResult> DeleteTrainingRecord(Guid id)
        {
            var userId = User.FindFirst("userId")?.Value;
            var role = User.FindFirst("role")?.Value;
            var department = User.FindFirst("department")?.Value;

            if (role == "Manager" && department != "Support")
                return Forbid();
            if (role == "Trainer")
            {
                var trainer = await _courseService.GetTrainerByRegisteredCourseIdAsync(id);
                if (userId != trainer.Id.ToString())
                    return Forbid();
            }
            await _trainingRecordService.DeleteTrainingRecordAsync(id);
            return Ok(new { message = "Training record deleted successfully" });
        }

        [HttpGet("user-training-records/{userId}")]
        public async Task<IActionResult> GetUserTrainingRecords(Guid userId)
        {
            var id = User.FindFirst("userId")?.Value;
            if (id == null)
                return Forbid();
            var role = User.FindFirst("role")?.Value;
            var department = User.FindFirst("department")?.Value;
            var trainingRecords = await _trainingRecordService.GetTrainingRecordsByUserIdAsync(userId);
            if(role == "Manager" && department != "Support")
                return Forbid();
            if (role == "Trainer")
            {
                var trainer = await _courseService.GetTrainerByRegisteredCourseIdAsync(Guid.Parse(id));
                if (id != trainer.Id.ToString())
                    return Forbid();
            }
            if (role == "User")
            {
                var member = await _courseService.GetMemberByRegisteredCourseIdAsync(Guid.Parse(id));
                if (userId != member.Id)
                    return Forbid();
            }

            return Ok(trainingRecords);
        }

        [HttpGet("trainer/{trainerId}")]
        public async Task<IActionResult> GetTrainingRecordByTrainerId(Guid trainerId)
        {
            var id = User.FindFirst("userId")?.Value;
            if (id == null)
                return Forbid();
            var role = User.FindFirst("role")?.Value;
            var department = User.FindFirst("department")?.Value;
            if (role == "Manager" && department != "Support")
                return Forbid();
            if (role == "Trainer")
            {
                var trainer = await _courseService.GetTrainerByRegisteredCourseIdAsync(Guid.Parse(id));
                if (id != trainer.Id.ToString())
                    return Forbid();
            }
            var trainingRecords = await _trainingRecordService.GetTrainingRecordsByTrainerIdAsync(trainerId);
            return Ok(trainingRecords);
        }
    }
}