using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShopForHome.Services;

namespace ShopForHome.Controllers.Api
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/[controller]")]
    public class ReportsApiController : ControllerBase
    {
        private readonly ReportService _reportService;
        public ReportsApiController(ReportService reportService) => _reportService = reportService;

        // GET api/reports/sales?from=2025-01-01&to=2025-01-31
        [HttpGet("sales")]
        public async Task<IActionResult> SalesReport([FromQuery] DateTime from, [FromQuery] DateTime to)
        {
            if (from == default || to == default) return BadRequest("Provide from and to query parameters as ISO dates.");

            var report = await _reportService.GetSalesReportAsync(from.Date, to.Date.AddDays(1).AddTicks(-1));
            return Ok(report);
        }
    }
}
