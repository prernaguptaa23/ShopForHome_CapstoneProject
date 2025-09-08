using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopForHome.Data;
using ShopForHome.Models;
using System.Security.Claims;

namespace ShopForHome.Controllers.Api
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersApiController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrdersApiController(AppDbContext context)
        {
            _context = context;
        }

        // ----------------------------------------
        // POST api/orders → Place new order
        // ----------------------------------------
        [Authorize]
        [HttpPost]
public async Task<IActionResult> PlaceOrder([FromBody] PlaceOrderDto dto)
{
    var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
    if (!int.TryParse(userIdClaim, out var userId))
        return Unauthorized("Invalid user.");

    if (dto.Items == null || dto.Items.Count == 0)
        return BadRequest("Order must have items.");

    decimal total = 0;

    var order = new Order
    {
        UserId = userId,
        Status = "Pending",
        OrderDate = DateTime.UtcNow,
        CreatedAt = DateTime.UtcNow,
        OrderItems = new List<OrderItem>()
    };

    foreach (var item in dto.Items)
    {
        var product = await _context.Products.FindAsync(item.ProductId);
        if (product == null) return BadRequest($"Product {item.ProductId} not found.");
        if (product.StockQuantity < item.Quantity) return BadRequest($"Not enough stock for {product.Name}.");

        product.StockQuantity -= item.Quantity;

        var orderItem = new OrderItem
        {
            ProductId = product.ProductId,
            Quantity = item.Quantity,
            PriceAtPurchase = product.Price,
            CreatedAt = DateTime.UtcNow
        };

        total += product.Price * item.Quantity;
        order.OrderItems.Add(orderItem);
    }

    order.TotalAmount = total;

    // -------------------------------
    // 🔑 Apply coupon if provided
    // -------------------------------
    order.DiscountAmount = 0;
    if (!string.IsNullOrEmpty(dto.CouponCode))
    {
        var coupon = await _context.Coupons
            .FirstOrDefaultAsync(c => c.Code == dto.CouponCode );

         if (coupon == null)
        return BadRequest("Invalid coupon code.");

    if (DateTime.UtcNow < coupon.ValidFrom)
        return BadRequest("Coupon not valid yet.");

    if (DateTime.UtcNow > coupon.ValidTo)
        return BadRequest("Coupon expired.");

    if (coupon.MaxUses.HasValue && coupon.TotalUsed > coupon.MaxUses)
        return BadRequest("Coupon usage limit reached.");

        // ✅ Always apply percentage discount
    order.DiscountAmount = (total * coupon.DiscountPercent) / 100;

    // increment usage
    coupon.TotalUsed++;
    }

    // -------------------------------
    // GST + Final totals
    // -------------------------------
    order.GST = (total - order.DiscountAmount) * 0.12m;  // GST on discounted amount
    order.PayableAmount = total - order.DiscountAmount + order.GST;
    order.GrandTotal = order.PayableAmount;
    order.BalanceAmount = order.PayableAmount;

    _context.Orders.Add(order);
    await _context.SaveChangesAsync();

    return Ok(new { message = "Order placed successfully", orderId = order.OrderId });
}


        // ----------------------------------------
        // GET api/orders/user → Orders of logged-in user
        // ----------------------------------------
        [Authorize]
        [HttpGet("user")]
        public async Task<IActionResult> GetUserOrders()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdClaim, out var userId))
                return Unauthorized("Invalid user.");

            var orders = await _context.Orders
                .Include(o => o.OrderItems!)
                .ThenInclude(oi => oi.Product)
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            return Ok(orders);
        }

        // ----------------------------------------
        // GET api/orders/{id} → Order details
        // ----------------------------------------
        [Authorize]
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetOrder(int id)
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems!)
                .ThenInclude(oi => oi.Product)
                .FirstOrDefaultAsync(o => o.OrderId == id);

            if (order == null)
                return NotFound();

            var loggedInUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            // Non-admins can only see their own orders
            if (!User.IsInRole("Admin") && order.UserId != loggedInUserId)
                return Forbid();

            return Ok(order);
        }

        // ----------------------------------------
        // Admin only: GET api/orders → All orders
        // ----------------------------------------
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderItems!)
                .ThenInclude(oi => oi.Product)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            return Ok(orders);
        }
    }

    // -------------------------------
    // DTOs
    // -------------------------------
    public class PlaceOrderDto
    {
        public List<OrderItemDto> Items { get; set; } = new();
        public string? CouponCode { get; set; }  // optional for discounts
    }

    public class OrderItemDto
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }

    }
}
