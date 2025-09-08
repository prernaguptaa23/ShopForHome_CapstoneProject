using Microsoft.EntityFrameworkCore;
using ShopForHome.Models;

namespace ShopForHome.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<Role> Roles => Set<Role>();
        public DbSet<UserRole> UserRoles => Set<UserRole>();
        public DbSet<Category> Categories => Set<Category>();
        public DbSet<Product> Products => Set<Product>();
        public DbSet<Cart> Carts => Set<Cart>();
        public DbSet<CartItem> CartItems => Set<CartItem>();
        public DbSet<Wishlist> Wishlists => Set<Wishlist>();
        public DbSet<Order> Orders => Set<Order>();
        public DbSet<OrderItem> OrderItems => Set<OrderItem>();
        public DbSet<Coupon> Coupons => Set<Coupon>();
        public DbSet<UserCoupon> UserCoupons => Set<UserCoupon>();

        public DbSet<Wishlist> wishlists => Set<Wishlist>();
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

        
            // =========================
            // Seed Roles (static)
            // =========================
            modelBuilder.Entity<Role>().HasData(
    new Role { RoleId = 1, RoleName = "User", Description = "Regular user", CreatedAt = new DateTime(2025, 9, 1) },
    new Role { RoleId = 2, RoleName = "Admin", Description = "Administrator", CreatedAt = new DateTime(2025, 9, 1) }
);

            // =========================
            // UserRoles: Composite Unique Key
            // =========================
            modelBuilder.Entity<UserRole>()
                .HasIndex(ur => new { ur.UserId, ur.RoleId })
                .IsUnique();

            // =========================
            // Wishlist: Composite Unique Key
            // =========================
            modelBuilder.Entity<Wishlist>()
                .HasIndex(w => new { w.UserId, w.ProductId })
                .IsUnique();

            // =========================
            // Product: Price & GST precision
            // =========================
            modelBuilder.Entity<Product>()
                .Property(p => p.Price)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Product>()
                .Property(p => p.GST)
                .HasPrecision(18, 2);

            // =========================
            // Cart - CartItem relationship
            // =========================
            modelBuilder.Entity<Cart>()
                .HasMany(c => c.CartItems)
                .WithOne(ci => ci.Cart)
                .HasForeignKey(ci => ci.CartId);

            // =========================
            // Product - CartItem relationship
            // =========================
            modelBuilder.Entity<CartItem>()
                .HasOne(ci => ci.Product)
                .WithMany()
                .HasForeignKey(ci => ci.ProductId);

            // =========================
            // Wishlist - User relationship
            // =========================
            modelBuilder.Entity<Wishlist>()
                .HasOne(w => w.User)
                .WithMany()
                .HasForeignKey(w => w.UserId)
                .OnDelete(DeleteBehavior.Cascade);

        
            // =========================
// UserCoupon - User relationship
modelBuilder.Entity<UserCoupon>()
    .HasOne(uc => uc.User)
    .WithMany()
    .HasForeignKey(uc => uc.UserId)
    .OnDelete(DeleteBehavior.Restrict); // Prevent multiple cascade paths

// UserCoupon - Coupon relationship
modelBuilder.Entity<UserCoupon>()
    .HasOne(uc => uc.Coupon)
    .WithMany()
    .HasForeignKey(uc => uc.CouponId)
    .OnDelete(DeleteBehavior.Restrict);

// Optional: Coupon - User relationship (CreatedBy)
modelBuilder.Entity<Coupon>()
    .HasOne(c => c.User)
    .WithMany()
    .HasForeignKey(c => c.CreatedBy)
    .OnDelete(DeleteBehavior.Restrict);


            // =========================
            // You can add static seed data for Category, Product, etc.
            // Example:
            modelBuilder.Entity<Category>().HasData(
                new Category { CategoryId = 1, Name = "Furniture", Description = "All kinds of home and office furniture", CreatedAt = new DateTime(2025, 09, 01, 0, 0, 0), UpdatedAt = new DateTime(2025, 09, 01, 0, 0, 0) },
                new Category { CategoryId = 2, Name = "Home Décor", Description = "Decorative items for home and office, such as vases, wall art, clocks, and showpieces.", CreatedAt = new DateTime(2025, 09, 01, 0, 0, 0), UpdatedAt = new DateTime(2025, 09, 01, 0, 0, 0)},
                new Category { CategoryId = 3, Name = "Lighting", Description = "Lighting solutions including lamps, ceiling lights, LED lights, and decorative lighting.", CreatedAt = new DateTime(2025, 09, 01, 0, 0, 0), UpdatedAt = new DateTime(2025, 09, 01, 0, 0, 0) }
            );
        }
    }
}
