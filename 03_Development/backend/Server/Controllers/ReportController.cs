using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Routing;
using Server.DTOs.Report;
using Server.Interfaces.IServices;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ReportController : ControllerBase
    {
        private readonly IReportService _reportService;
        public ReportController(IReportService reportService)
        {
            _reportService = reportService;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateReport([FromBody] CreateReportDTO createReportDTO)
        {
            var userId = User.FindFirst("userId")?.Value;
            if (userId == null)
            {
                return Unauthorized();
            }
            await _reportService.CreateReportAsync(Guid.Parse(userId), createReportDTO);
            return Ok(new { message = "Create report successful" });
        }

        [HttpGet("{reportId}")]
        public async Task<IActionResult> GetReportById(Guid reportId)
        {
            var role = User.FindFirst("role")?.Value;
            var department = User.FindFirst("department")?.Value;
            var report = await _reportService.GetReportByIdAsync(reportId);
            if( role == "Manager" && department != "Support")
            {
                return Forbid();
            }
            if(role == "Trainer" || role == "Member")
            {
                var userId = User.FindFirst("userId")?.Value;
                if (userId != report.CreatedBy.ToString())
                {
                    return Forbid();
                }
            }
            return Ok(report);
        }

        [HttpPut("update")]
        public async Task<IActionResult> UpdateReport([FromBody] UpdateReportDTO updateReportDTO)
        {
            var userId = User.FindFirst("userId")?.Value;
            var report = await _reportService.GetReportByIdAsync(updateReportDTO.Id);
            if (userId != report.CreatedBy.ToString())
            {
                return Forbid();
            }
            await _reportService.UpdateReportAsync(updateReportDTO);
            return Ok(new { message = "Update report successful" });
        }

        [HttpPut("change-status")]
        [Authorize(Roles = "Admin, Manager")]
        public async Task<IActionResult> ChangeReportStatus([FromBody] ChangeReportStatusDTO changeReportStatusDTO)
        {
            var role = User.FindFirst("role")?.Value;
            var department = User.FindFirst("department")?.Value;
            if (role == "Manager" && department != "Support")
            {
                return Forbid();
            }
            await _reportService.ChangeReportStatusAsync(changeReportStatusDTO);
            return Ok(new { message = "Change report status successful" });
        }

        [HttpDelete("delete/{reportId}")]
        public async Task<IActionResult> DeleteReport(Guid reportId)
        {
            var userId = User.FindFirst("userId")?.Value;
            var report = await _reportService.GetReportByIdAsync(reportId);
            if (userId != report.CreatedBy.ToString())
            {
                return Forbid();
            }
            await _reportService.DeleteReportAsync(reportId);
            return Ok(new { message = "Delete report successful" });
        }

        [HttpGet("all")]
        [Authorize(Roles = "Admin, Manager")]
        public async Task<IActionResult> GetAllReports()
        {
            var role = User.FindFirst("role")?.Value;
            var department = User.FindFirst("department")?.Value;
            if (role == "Manager" && department != "Support")
            {
                return Forbid();
            }
            var reports = await _reportService.GetReportsAsync();
            return Ok(reports);
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetReportsByUserId(Guid userId)
        {
            var role = User.FindFirst("role")?.Value;
            var department = User.FindFirst("department")?.Value;
            if (role == "Manager" && department != "Support")
            {
                return Forbid();
            }
            if (role == "Trainer" || role == "Member")
            {
                var currentUserId = User.FindFirst("userId")?.Value;
                if (currentUserId != userId.ToString())
                {
                    return Forbid();
                }
            }
            var reports = await _reportService.GetReportsByUserIdAsync(userId);
            return Ok(reports);
        }

        [HttpGet("type/{reportType}")]
        [Authorize(Roles = "Admin, Manager")]
        public async Task<IActionResult> GetReportsByType(string reportType)
        {
            var role = User.FindFirst("role")?.Value;
            var department = User.FindFirst("department")?.Value;
            if (role == "Manager" && department != "Support")
            {
                return Forbid();
            }
            var reports = await _reportService.GetReportsByTypeAsync(reportType);
            return Ok(reports);
        }

        [HttpGet("status/{status}")]
        [Authorize(Roles = "Admin, Manager")]
        public async Task<IActionResult> GetReportsByStatus(string status)
        {
            var role = User.FindFirst("role")?.Value;
            var department = User.FindFirst("department")?.Value;
            if (role == "Manager" && department != "Support")
            {
                return Forbid();
            }
            var reports = await _reportService.GetReportsByStatusAsync(status);
            return Ok(reports);
        }
    }
}