using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShopForHome.Models
{
    public class Coupon
    {
        [Key]
        public int CouponId { get; set; }   //PK

        [Required, MaxLength(100)]
        public string? Code { get; set; } = string.Empty;   // unique

        [Column(TypeName = "decimal(18,2)")]
        public decimal DiscountPercent { get; set; }
        public bool IsPublic { get; set; }

        public DateTime ValidFrom { get; set; }
        public DateTime ValidTo { get; set; }

        public int? MaxUses { get; set; }
        public int TotalUsed { get; set; }

        public int CreatedBy { get; set; }  // FK -> Admin userId

        [ForeignKey(nameof(CreatedBy))]
        public User? CreatedByUser { get; set; } = null;

        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public User? User { get; set; }
        

         // 👇 New property (Not mapped to DB, computed at runtime)
        [NotMapped]
        public bool IsActive =>
            DateTime.UtcNow >= ValidFrom &&
            DateTime.UtcNow <= ValidTo &&
            (MaxUses == null || TotalUsed < MaxUses);

    }
}
