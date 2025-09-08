using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopForHome.Data;
using ShopForHome.Models;
using System.Security.Claims;

namespace ShopForHome.Controllers.Api
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        // ----------------------------
        // Admin only: Get all users
        // ----------------------------
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        // ----------------------------
        // Get single user
        // Admin can get any user
        // Regular user can get only self
        // ----------------------------
        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var currentUserRole = User.FindFirstValue(ClaimTypes.Role);

            if (!int.TryParse(userIdClaim, out var currentUserId))
                return Unauthorized("Invalid user ID");

            if (currentUserRole != "Admin" && currentUserId != id)
                return Forbid("You can only access your own profile");

            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();
            return user;
        }

        // ----------------------------
        // Registration / open access
        // ----------------------------
        [AllowAnonymous]
        [HttpPost]
        public async Task<ActionResult<User>> CreateUser(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetUser), new { id = user.UserId }, user);
        }

        // ----------------------------
        // Update user
        // Admin can update any user
        // Regular user can update only self
        // ----------------------------
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, User user)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var currentUserRole = User.FindFirstValue(ClaimTypes.Role);

            if (!int.TryParse(userIdClaim, out var currentUserId))
                return Unauthorized("Invalid user ID");

            if (currentUserRole != "Admin" && currentUserId != id)
                return Forbid("You can only update your own profile");

            if (id != user.UserId) return BadRequest();

            _context.Entry(user).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // ----------------------------
        // Delete user
        // Only Admin
        // ----------------------------
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // ----------------------------
        // Optional: Get current logged-in user's profile
        // ----------------------------
        [Authorize]
        [HttpGet("profile")]
        public async Task<ActionResult<User>> GetProfile()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdClaim, out var currentUserId))
                return Unauthorized("Invalid user ID");

            var user = await _context.Users.FindAsync(currentUserId);
            if (user == null) return NotFound();
            return user;
        }
    }
}
