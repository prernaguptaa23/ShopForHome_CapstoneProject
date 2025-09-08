using System.ComponentModel.DataAnnotations;

namespace ShopForHome.Models
{
    public class Role
    {
        [Key]
        public int RoleId { get; set; }   //PK

        [Required, MaxLength(50)]
        public string? RoleName { get; set; }  // e.g., "User", "Admin"

        [MaxLength(500)]
        public string? Description { get; set; }

        public DateTime CreatedAt { get; set; } 
        public DateTime? UpdatedAt { get; set; } 

    }
}
