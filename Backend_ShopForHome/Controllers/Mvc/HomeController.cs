using Microsoft.AspNetCore.Mvc;

namespace ShopForHome.Controllers.Mvc
{
        public class HomeController : Controller
    {
        public IActionResult Index() => View();
        public IActionResult About() => View();
        public IActionResult Contact() => View();
    }
}
