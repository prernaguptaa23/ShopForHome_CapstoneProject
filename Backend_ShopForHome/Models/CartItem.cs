using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShopForHome.Models
{
    public class CartItem
    {
        [Key]
        public int CartItemId { get; set; }   //PK

        [Required]
        public int CartId { get; set; }   //FK
        public Cart? Cart { get; set; }

        [Required]
        public int ProductId { get; set; }   //FK
        public Product? Product { get; set; }

        public int Quantity { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }         // price of single product

        [Column(TypeName = "decimal(18,2)")]
        public decimal DiscountAmount { get; set; } // discount applied

        [Column(TypeName = "decimal(18,2)")]
        public decimal GST { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal FinalPrice { get; set; }    // calculated after discount + GST

        public DateTime CreatedAt { get; set; } 
        public DateTime? UpdatedAt { get; set; } 
    }
}
