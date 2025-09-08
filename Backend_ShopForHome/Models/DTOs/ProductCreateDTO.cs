namespace ShopForHome.Models.DTOs
{
    public class ProductCreateDto
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public string? ImagePath { get; set; }
        public int StockQuantity { get; set; }
        public decimal GST { get; set; }
        public int CategoryId { get; set; } // Only necessary fields for POST
    }
}
