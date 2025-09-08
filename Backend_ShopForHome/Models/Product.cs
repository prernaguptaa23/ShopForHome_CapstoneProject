using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ShopForHome.Models
{
    public class Product
    {
        [Key]
        [JsonIgnore] // Hide from POST example
        public int ProductId { get; set; }

        [Required, StringLength(150)]
        public string? Name { get; set; }

        [StringLength(500)]
        public string? Description { get; set; }

        [Required]
        public decimal Price { get; set; }

        public string? ImagePath { get; set; }

        [Required]
        public int StockQuantity { get; set; }

        public decimal GST { get; set; }

        [Required]
        public int CategoryId { get; set; }

        [JsonIgnore] // Hide timestamps from POST example
        public DateTime CreatedAt { get; set; }

        [JsonIgnore]
        public DateTime? UpdatedAt { get; set; }

        [JsonIgnore] // Hide navigation property from POST example
        public Category? Category { get; set; }
    }
}
