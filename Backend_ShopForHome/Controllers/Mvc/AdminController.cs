using Microsoft.AspNetCore.Mvc;

namespace ShopForHome.Controllers.Mvc
{
    
    public class AdminController : Controller
    {
        [HttpGet]
        public IActionResult Dashboard() => View();
        public IActionResult ManageUsers() => View();
        public IActionResult ManageProducts() => View();
        public IActionResult StockAlerts() => View();
    }
}
