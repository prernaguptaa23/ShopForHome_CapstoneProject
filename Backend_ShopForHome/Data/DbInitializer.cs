using System.Security.Cryptography;
using System.Text;
using ShopForHome.Models;

namespace ShopForHome.Data
{
    public static class DbInitializer
    {
        public static void Initialize(AppDbContext context)
        {
            context.Database.EnsureCreated();

            // Seed roles already handled in OnModelCreating; seed admin user if not present
            if (!context.Users.Any(u => u.Email == "admin@shop.com"))
            {
                var admin = new User
                {
                    FullName = "Admin User",
                    Email = "admin@shop.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                    UserRole = "Admin", 
                    CreatedAt = new DateTime(2025, 09, 01, 0, 0, 0),
                };
                context.Users.Add(admin);
                context.SaveChanges();

                context.UserRoles.Add(new UserRole
                {
                    UserId = admin.UserId,
                    RoleId = 2,
                    CreatedAt = new DateTime(2025, 09, 01, 0, 0, 0),
                });
                context.SaveChanges();
            }

            // Seed categories and sample products if none exist
            if (!context.Categories.Any())
            {
                var furniture = new Category { Name = "Furniture", Description = "All kinds of home and office furniture", CreatedAt = new DateTime(2025, 09, 01, 0, 0, 0), };
                var decor = new Category { Name = "Home Décor", Description = "Decorative items for home such as vases, wall art, clocks, and showpieces.", CreatedAt = new DateTime(2025, 09, 01, 0, 0, 0), };
                var lighting = new Category { Name = "Lighting", Description = "Lighting solutions including lamps, ceiling lights, LED lights, and decorative lighting.", CreatedAt = new DateTime(2025, 09, 01, 0, 0, 0), };
                context.Categories.AddRange(furniture, decor, lighting);
                context.SaveChanges();

                context.Products.AddRange(
                    new Product { Name = "Oak Dining Table", Description = "Solid oak table", Price = 19999M, StockQuantity = 5, GST = 18M, CategoryId = furniture.CategoryId, CreatedAt = new DateTime(2025, 09, 01, 0, 0, 0), },
                    new Product { Name = "Ceramic Vase", Description = "Handmade vase", Price = 799M, StockQuantity = 50, GST = 12M, CategoryId = decor.CategoryId, CreatedAt = new DateTime(2025, 09, 01, 0, 0, 0), },
                    new Product { Name = "Artisan Lamp", Description = "Table lamp", Price = 2999M, StockQuantity = 20, GST = 18M, CategoryId = lighting.CategoryId, CreatedAt = new DateTime(2025, 09, 01, 0, 0, 0), }
                );
                context.SaveChanges();
            }
        }

        
    }
}
