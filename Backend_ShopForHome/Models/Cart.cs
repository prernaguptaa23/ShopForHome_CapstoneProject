using System.ComponentModel.DataAnnotations;

namespace ShopForHome.Models
{
    public class Cart
    {
        [Key]
        public int CartId { get; set; }   //PK

        [Required]
        public int UserId { get; set; }   //FK
        public User? User { get; set; }

        public int? CouponId { get; set; }  // optional applied coupon
        public Coupon? Coupon { get; set; }

        public DateTime CreatedAt { get; set; } 
        public DateTime? UpdatedAt { get; set; } 

        // Multiple products in cart
        public ICollection<CartItem>? CartItems { get; set; } = new List<CartItem>();
    }
}
