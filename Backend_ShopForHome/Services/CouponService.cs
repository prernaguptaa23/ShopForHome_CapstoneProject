using Microsoft.EntityFrameworkCore;
using ShopForHome.Data;
using ShopForHome.Models;

namespace ShopForHome.Services
{
    public class CouponService
    {
        private readonly AppDbContext _db;
        public CouponService(AppDbContext db) => _db = db;

        public async Task<Coupon?> GetByCodeAsync(string code)
        {
            return await _db.Coupons.FirstOrDefaultAsync(c => c.Code == code);
        }

        public async Task<Coupon> CreateAsync(Coupon coupon)
        {
            coupon.CreatedAt = DateTime.UtcNow;
            _db.Coupons.Add(coupon);
            await _db.SaveChangesAsync();
            return coupon;
        }

        public async Task<Coupon?> GetByIdAsync(int id)
        {
            return await _db.Coupons
                .Include(c => c.CreatedByUser) // optional, if you have navigation property
                .FirstOrDefaultAsync(c => c.CouponId == id);
        }

        public async Task<bool> AssignToUserAsync(int couponId, int userId)
        {
            var exists = await _db.UserCoupons.AnyAsync(uc => uc.CouponId == couponId && uc.UserId == userId);
            if (exists) return false;
            var uc = new UserCoupon { CouponId = couponId, UserId = userId, CreatedAt = DateTime.UtcNow };
            _db.UserCoupons.Add(uc);
            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<bool> IsValidAsync(string code, int userId)
        {
            var coupon = await _db.Coupons.FirstOrDefaultAsync(c => c.Code == code);
            if (coupon == null) return false;
            var now = DateTime.UtcNow;
            if (now < coupon.ValidFrom || now > coupon.ValidTo) return false;
            if (coupon.MaxUses.HasValue && coupon.TotalUsed >= coupon.MaxUses.Value) return false;

            // If coupon is assigned to specific users, ensure the user has it
            var assigned = await _db.UserCoupons.FirstOrDefaultAsync(uc => uc.CouponId == coupon.CouponId && uc.UserId == userId);
            if (assigned == null && !coupon.IsPublic) return false;
            if (assigned != null && assigned.IsUsed) return false;

            return true;
        }
        
       
    }
}
