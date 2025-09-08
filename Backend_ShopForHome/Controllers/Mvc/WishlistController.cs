using Microsoft.AspNetCore.Mvc;

namespace ShopForHome.Controllers.Mvc
{

    public class WishlistController : Controller
    {
        public IActionResult Index() => View();
    }
}
