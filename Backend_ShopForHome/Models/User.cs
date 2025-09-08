using System.ComponentModel.DataAnnotations;

namespace ShopForHome.Models
{
    public class User
    {
        [Key]
        public int UserId { get; set; }   //PK
        
        [Required, MaxLength(100)]
        public string? FullName { get; set; }

        [Required, MaxLength(100)]
        public string? Email { get; set; }

        [Required]
        public string? PasswordHash { get; set; }

        [Required]
        [StringLength(20)]
        public string UserRole { get; set; } = "User"; 
        // default is "User", Admin will be set manually or during registration
    
        public DateTime CreatedAt { get; set; } 
        public DateTime? UpdatedAt { get; set; } 

    }
}
