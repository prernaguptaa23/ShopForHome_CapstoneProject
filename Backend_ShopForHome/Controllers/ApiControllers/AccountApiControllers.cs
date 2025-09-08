using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShopForHome.Data;
using ShopForHome.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ShopForHome.Controllers.Api
{
    [AllowAnonymous]
    [ApiController]
    [Route("api/[controller]")]
    public class AccountApiController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IConfiguration _config; // ✅ inject configuration
        public AccountApiController(AppDbContext db, IConfiguration config)
        {
            _db = db; _config = config;
        }

        // ✅ Register API
            [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterRequest req)
        {
            if (string.IsNullOrWhiteSpace(req.Email) || string.IsNullOrWhiteSpace(req.Password))
                return BadRequest("Email and password required.");

            if (_db.Users.Any(u => u.Email == req.Email))
                return BadRequest("Email already registered.");

            var hashed = BCrypt.Net.BCrypt.HashPassword(req.Password);
            var user = new User
            {
                FullName = req.FullName,
                Email = req.Email,
                PasswordHash = hashed,
                CreatedAt = DateTime.UtcNow
            };

            _db.Users.Add(user);
            _db.SaveChanges();

            return Ok(new { Message = "User registered successfully", user.UserId });
        }

        // ✅ Login API
        [HttpPost("login")]
public IActionResult Login([FromBody] LoginRequest req)
{
    var user = _db.Users.FirstOrDefault(u => u.Email == req.Email );
    if (user == null || !BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
        return Unauthorized("Invalid credentials.");

    // ✅ Create JWT token
    var claims = new[]
    {
        new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
        new Claim(ClaimTypes.Role, user.UserRole ?? "User"),
        
    };

    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("NzRkN2UwZjctNGViMS00ZTVlLWJlNTctNDg2YTJhMmU2YWZhMTg3YzMxZjktYjhjMS00ZTk1LThjMmYtMTE1Y2VkMGY4OWVl"));
    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

    var token = new JwtSecurityToken(
        issuer: "ShopForHome",
        audience: "ShopForHomeUsers",
        claims: claims,
        expires: DateTime.UtcNow.AddHours(2),
        signingCredentials: creds
    );

    var tokenString = new JwtSecurityTokenHandler().WriteToken(token);
 
return Ok(new 
{ 
    Message = "Login successful",
    user.UserId,
    user.FullName,    // ✅ add this
    user.Email,       // ✅ add this
    Role = user.UserRole ?? "User",  // optional role
    Token = tokenString
});
}
        
    }

    // DTOs (request models)
    public class RegisterRequest
    {
        public string FullName { get; set; } = "";
        public string Email { get; set; } = "";
        public string Password { get; set; } = "";
    }

    public class LoginRequest
    {
        public string Email { get; set; } = "";
        public string Password { get; set; } = "";
    }
}
