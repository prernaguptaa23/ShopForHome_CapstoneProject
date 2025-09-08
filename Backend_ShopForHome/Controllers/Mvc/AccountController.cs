using Microsoft.AspNetCore.Mvc;
using ShopForHome.Data;
using ShopForHome.Models;
using System.Security.Cryptography;
using System.Text;

namespace ShopForHome.Controllers.Mvc
{
    public class AccountController : Controller
    {
        private readonly AppDbContext _db;
        public AccountController(AppDbContext db) => _db = db;

        [HttpGet]
        public IActionResult Login() => View();

        
        [HttpGet]
        public IActionResult Register() => View();

        [HttpPost]
        public IActionResult Register(string fullName, string email, string password)
        {
            if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
                return View();

            if (_db.Users.Any(u => u.Email == email))
            {
                ModelState.AddModelError("", "Email already registered.");
                return View();
            }

            var hashed = ComputeHash(password);
            var user = new User { FullName = fullName, Email = email, PasswordHash = hashed, CreatedAt = DateTime.UtcNow };
            _db.Users.Add(user);
            _db.SaveChanges();
            return RedirectToAction("Login");
        }

        [HttpPost]
        public IActionResult Login(string email, string password)
        {
            var hashed = ComputeHash(password);
            var user = _db.Users.FirstOrDefault(u => u.Email == email && u.PasswordHash == hashed);
            if (user == null)
            {
                ModelState.AddModelError("", "Invalid credentials.");
                return View();
            }

            TempData["UserId"] = user.UserId;
            return RedirectToAction("Index", "Home");
        }

        public IActionResult Logout()
        {
            TempData.Remove("UserId");
            return RedirectToAction("Index", "Home");
        }

        private static string ComputeHash(string input)
        {
            using var sha = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(input);
            return Convert.ToBase64String(sha.ComputeHash(bytes));
        }
    }
}
