using System.ComponentModel.DataAnnotations;

namespace ShopForHome.Models
{
    public class UserCoupon
    {
        [Key]
        public int UserCouponId { get; set; }   //PK

        [Required]
        public int UserId { get; set; }   //FK
        public User? User { get; set; }


        [Required]
        public int CouponId { get; set; }   //FK
        public Coupon? Coupon { get; set; }

        public bool IsUsed { get; set; } = false;

        public DateTime CreatedAt { get; set; } 
        public DateTime? UpdatedAt { get; set; } 
    }
}
