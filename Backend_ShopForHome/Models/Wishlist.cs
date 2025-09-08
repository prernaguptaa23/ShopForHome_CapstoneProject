using System.ComponentModel.DataAnnotations;

namespace ShopForHome.Models
{
    public class Wishlist
    {
        [Key]
        public int WishlistId { get; set; }
        public int UserId { get; set; }
        public int ProductId { get; set; }
        public DateTime CreatedAt { get; set; }

        // Navigation properties
        public User? User { get; set; }
        public Product? Product { get; set; }
    }
}
