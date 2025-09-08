using Microsoft.AspNetCore.Mvc;

namespace ShopForHome.Controllers.Mvc
{
    public class OrderController : Controller
    {
        public IActionResult Checkout() => View();
        public IActionResult History() => View();
    }
}
