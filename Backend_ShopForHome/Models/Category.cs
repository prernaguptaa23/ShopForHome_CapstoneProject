using System.ComponentModel.DataAnnotations;

namespace ShopForHome.Models
{
    public class Category
    {
        [Key]
        public int CategoryId { get; set; }   //PK

        [Required, MaxLength(100)]
        public string? Name { get; set; } = string.Empty;
        public string? Description { get; set; }

        public DateTime CreatedAt { get; set; } 
        public DateTime? UpdatedAt { get; set; } 

    }
}
