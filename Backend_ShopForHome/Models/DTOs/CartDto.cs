public class CartItemDto
{
    public int ProductId { get; set; }
    public string? ProductName { get; set; }
    public int Quantity { get; set; }
    public decimal Price { get; set; }
    public decimal GST { get; set; }
    public decimal FinalPrice { get; set; }
}

public class CartDto
{
    public int CartId { get; set; }
    public int UserId { get; set; }
    public string? UserName { get; set; }
    public string? CouponCode { get; set; }
    public List<CartItemDto>? Items { get; set; } = new();
    public DateTime CreatedAt { get; set; }
}
