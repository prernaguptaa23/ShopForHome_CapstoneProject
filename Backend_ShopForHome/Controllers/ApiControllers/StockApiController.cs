using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopForHome.Data;
using ShopForHome.Models;

namespace ShopForHome.Controllers.Api
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/[controller]")]
    public class StockController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StockController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/stock/low
        [HttpGet("low")]
        public async Task<ActionResult<IEnumerable<Product>>> GetLowStockProducts()
        {
            return await _context.Products.Where(p => p.StockQuantity < 10).ToListAsync();
        }
    }
}
