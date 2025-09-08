using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
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
    public class CartApiController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CartApiController(AppDbContext context)
        {
            _context = context;
        }

        // Update cart item quantity
        [HttpPut("update")]
[Authorize]
public async Task<IActionResult> UpdateCartItem([FromQuery] int productId, [FromQuery] int quantity)
{
    var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    var cart = await _context.Carts
        .Include(c => c.CartItems)
        .FirstOrDefaultAsync(c => c.UserId == userId);

    if (cart == null) return NotFound("Cart not found");

    var existingItem = cart.CartItems!.FirstOrDefault(ci => ci.ProductId == productId);
    if (existingItem == null) return NotFound("Product not in cart");

    // ✅ Set quantity directly instead of adding
    existingItem.Quantity = quantity;
    existingItem.FinalPrice = (existingItem.Price - existingItem.DiscountAmount) 
                                * existingItem.Quantity 
                                * (1 + existingItem.GST / 100);

    await _context.SaveChangesAsync();
    return Ok("Cart updated");
}


        [Authorize]
        // Add product to cart
        [HttpPost("add")]
public async Task<IActionResult> AddToCart([FromQuery] int productId, [FromQuery] int quantity)
{
    var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!); // from token
     var product = await _context.Products.FindAsync(productId);
            if (product == null) return NotFound("Product not found");

            // Get or create cart for user
            var cart = await _context.Carts
                .Include(c => c.CartItems)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
            {
                cart = new Cart
                {
                    UserId = userId,
                    CreatedAt = DateTime.UtcNow
                };
                _context.Carts.Add(cart);
                await _context.SaveChangesAsync();
            }

            // Check if product already in cart
            var existingItem = cart.CartItems!.FirstOrDefault(ci => ci.ProductId == productId);
            if (existingItem != null)
            {
                existingItem.Quantity += quantity;
                existingItem.FinalPrice = (existingItem.Price - existingItem.DiscountAmount) * existingItem.Quantity * (1 + existingItem.GST / 100);
            }
            else
            {
                var cartItem = new CartItem
                {
                    CartId = cart.CartId,
                    ProductId = productId,
                    Quantity = quantity,
                    Price = product.Price,
                    GST = product.GST,
                    DiscountAmount = 0,
                    FinalPrice = quantity * product.Price * (1 + product.GST / 100),
                    CreatedAt = DateTime.UtcNow
                };
                _context.CartItems.Add(cartItem);
            }

            await _context.SaveChangesAsync();
            return Ok("Product added to cart");
        }

        // Get cart by user
        [HttpGet("me")]
public async Task<ActionResult<CartDto>> GetMyCart()
{
    var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    var cart = await _context.Carts
                .Include(c => c.CartItems!)
                    .ThenInclude(ci => ci.Product)
                .Include(c => c.User)
                .Include(c => c.Coupon)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null) return NotFound();

            var cartDto = new CartDto
            {
                CartId = cart.CartId,
                UserId = cart.UserId,
                UserName = cart.User?.FullName,
                CouponCode = cart.Coupon?.Code,
                CreatedAt = cart.CreatedAt,
                Items = cart.CartItems!.Select(ci => new CartItemDto
                {
                    ProductId = ci.ProductId,
                    ProductName = ci.Product?.Name,
                    Quantity = ci.Quantity,
                    Price = ci.Price,
                    GST = ci.GST,
                    FinalPrice = ci.FinalPrice
                }).ToList()
            };

            return Ok(cartDto);
        }

        // Remove product from cart
        [HttpDelete("remove")]
        public async Task<IActionResult> RemoveFromCart(int productId)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!); // from JWT token
            var cart = await _context.Carts
                .Include(c => c.CartItems)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null) return NotFound();

            var item = cart.CartItems!.FirstOrDefault(ci => ci.ProductId == productId);
            if (item == null) return NotFound("Product not in cart");

            cart.CartItems!.Remove(item);
            await _context.SaveChangesAsync();

            return Ok("Product removed from cart");
        }
    }
}
