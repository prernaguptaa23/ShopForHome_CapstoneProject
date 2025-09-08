using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopForHome.Data;
using ShopForHome.Models;
using System.Security.Claims;

namespace ShopForHome.Controllers.Api
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class WishlistController : ControllerBase
    {
        private readonly AppDbContext _context;

        public WishlistController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/wishlist/me
        [HttpGet("me")]
        public async Task<ActionResult<IEnumerable<WishlistDto>>> GetMyWishlist()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized();

            var userId = int.Parse(userIdClaim);

           var wishlist = await _context.Wishlists
                             .Include(w => w.Product)
                             .Where(w => w.UserId == userId)
                             .ToListAsync();

var result = wishlist.Select(w => new WishlistDto
{
    WishlistId = w.WishlistId,
    ProductId = w.ProductId,
    Name = w.Product?.Name,
    Description = w.Product?.Description,
    Price = w.Product?.Price ?? 0,
    ImagePath = w.Product?.ImagePath
}).ToList();

return Ok(result);

        }

        // POST: api/wishlist/add
        // POST: api/wishlist/add
[HttpPost("add")]
public async Task<ActionResult<WishlistDto>> AddToWishlist([FromBody] AddWishlistRequest req)
{
    var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
    if (string.IsNullOrEmpty(userIdClaim))
        return Unauthorized();

    var userId = int.Parse(userIdClaim);

    if (req == null || req.ProductId <= 0)
        return BadRequest("Invalid product.");

    var existing = await _context.Wishlists
        .FirstOrDefaultAsync(w => w.UserId == userId && w.ProductId == req.ProductId);

    if (existing != null)
        return Conflict("Product already in wishlist.");

    var wishlist = new Wishlist
    {
        UserId = userId,
        ProductId = req.ProductId,
        CreatedAt = DateTime.UtcNow
    };

    _context.Wishlists.Add(wishlist);
    await _context.SaveChangesAsync();

    // Map to DTO
    var product = await _context.Products.FindAsync(req.ProductId);
    if (product == null)
        return NotFound("Product not found.");

    var dto = new WishlistDto
    {
        WishlistId = wishlist.WishlistId,
        ProductId = wishlist.ProductId,
        Name = product.Name,
        Description = product.Description,
        Price = product.Price,
        ImagePath = product.ImagePath
    };

    return Ok(dto);
}


        // DELETE: api/wishlist/remove/5
        [HttpDelete("remove/{id}")]
        public async Task<IActionResult> RemoveFromWishlist(int id)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized();

            var userId = int.Parse(userIdClaim);

            var item = await _context.Wishlists
                                     .FirstOrDefaultAsync(w => w.WishlistId == id && w.UserId == userId);
            if (item == null) return NotFound();

            _context.Wishlists.Remove(item);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }

    // DTO for adding wishlist
    public class AddWishlistRequest
    {
        public int ProductId { get; set; }
    }
    
    public class WishlistDto {
    public int WishlistId { get; set; }
    public int ProductId { get; set; }   // 🔑 include this
    public string? Name { get; set; }
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public string? ImagePath { get; set; }
}

}
