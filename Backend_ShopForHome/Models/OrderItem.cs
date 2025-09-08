using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ShopForHome.Models
{
    public class OrderItem
    {
        [Key]
        public int OrderItemId { get; set; }   //PK

        [Required]
        public int OrderId { get; set; }   //FK

        [JsonIgnore]
        public Order? Order { get; set; }

        [Required]
        public int ProductId { get; set; }   //FK
        public Product? Product { get; set; }

        public int Quantity { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal PriceAtPurchase { get; set; }

        public DateTime CreatedAt { get; set; } 
        public DateTime? UpdatedAt { get; set; } 
    }
}
