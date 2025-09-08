using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopForHome.Data;

namespace ShopForHome.Controllers.Mvc
{
    public class ProductController : Controller
    {
        private readonly AppDbContext _db;
        public ProductController(AppDbContext db) => _db = db;

        public IActionResult Index() => View(); // you can pass categories / products via model

        public IActionResult Details(int id)
        {
            var product = _db.Products.Include(p => p.Category).FirstOrDefault(p => p.ProductId == id);
            if (product == null) return NotFound();
            return View(product);
        }
    }
}
