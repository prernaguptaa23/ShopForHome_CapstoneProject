using Microsoft.AspNetCore.Mvc;
using ShopForHome.Data;

namespace ShopForHome.Controllers.Mvc
{
    
    public class CartController : Controller
    {
        private readonly AppDbContext _db;
        public CartController(AppDbContext db) => _db = db;

        public IActionResult Index() => View(); // load cart items for logged in user
    }
}
