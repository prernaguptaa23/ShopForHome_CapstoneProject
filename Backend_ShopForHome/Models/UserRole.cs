using System.ComponentModel.DataAnnotations;

namespace ShopForHome.Models
{
    public class UserRole
    {
        [Key]
        public int UserRoleId { get; set; }   //PK

        [Required]
        public int UserId { get; set; }
        public User? User { get; set; }

        [Required]
        public int RoleId { get; set; }
        public Role? Role { get; set; }

        public DateTime CreatedAt { get; set; } 
        public DateTime? UpdatedAt { get; set; } 
    }
}
