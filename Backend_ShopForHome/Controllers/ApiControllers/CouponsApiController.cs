using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShopForHome.Models;
using ShopForHome.Services;
using System.Security.Claims;

namespace ShopForHome.Controllers.Api
{
    [ApiController]
    [Route("api/[controller]")]
    public class CouponsApiController : ControllerBase
    {
        private readonly CouponService _couponService;

        public CouponsApiController(CouponService couponService) => _couponService = couponService;

        // ----------------------------
        // Admin only: Create coupon
        // ----------------------------
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CouponCreateDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Code)) return BadRequest("Code required.");

            // Use logged-in Admin as CreatedBy
            var createdByClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            dto.CreatedBy = int.TryParse(createdByClaim, out var adminId) ? adminId : 0;

            var coupon = new Coupon
            {
                Code = dto.Code.Trim().ToUpper(),
                DiscountPercent = dto.DiscountPercent,
                IsPublic = dto.IsPublic,
                ValidFrom = dto.ValidFrom.ToUniversalTime(), // convert to UTC
                ValidTo = dto.ValidTo.ToUniversalTime(),
                MaxUses = dto.MaxUses,
                CreatedBy = dto.CreatedBy,
                CreatedAt = DateTime.UtcNow
            };

            var created = await _couponService.CreateAsync(coupon);
            return CreatedAtAction(nameof(GetById), new { id = created.CouponId }, created);
        }

        

        // ----------------------------
        // Get coupon by ID
        // Any authenticated user
        // ----------------------------
        [Authorize]
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var coupon = await _couponService.GetByIdAsync(id);
            if (coupon == null) return NotFound();
            return Ok(coupon);
        }

        // ----------------------------
        // Admin only: Assign coupon to user
        // ----------------------------
        [Authorize(Roles = "Admin")]
        [HttpPost("assign")]
        public async Task<IActionResult> Assign([FromBody] AssignCouponDto dto)
        {
            var ok = await _couponService.AssignToUserAsync(dto.CouponId, dto.UserId);
            if (!ok) return BadRequest("Could not assign (maybe already assigned).");
            return Ok();
        }

        // ----------------------------
        // Any authenticated user: Validate coupon
        // ----------------------------
        [Authorize]
[HttpPost("validate")]
public async Task<IActionResult> Validate([FromBody] ValidateCouponDto dto)
{
    var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
    if (!int.TryParse(userIdClaim, out var userId))
        return Unauthorized("Invalid user.");

    var ok = await _couponService.IsValidAsync(dto.Code, userId); // ✅ Only validate
    if (!ok) return BadRequest("Invalid or expired coupon.");

    return Ok(new { message = "Coupon valid" });
}

    }

    public class CouponCreateDto
    {
        public string Code { get; set; } = null!;
        public decimal DiscountPercent { get; set; }
        public bool IsPublic { get; set; }
        public DateTime ValidFrom { get; set; }
        public DateTime ValidTo { get; set; }
        public int? MaxUses { get; set; }
        public int CreatedBy { get; set; }
    }

    public class AssignCouponDto { public int CouponId { get; set; } public int UserId { get; set; } }

    public class ValidateCouponDto { public string Code { get; set; } = null!; }
}
