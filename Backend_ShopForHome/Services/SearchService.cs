using Microsoft.EntityFrameworkCore;
using ShopForHome.Data;
using ShopForHome.Models;

namespace ShopForHome.Services
{
    public class SearchService
    {
        private readonly AppDbContext _db;
        public SearchService(AppDbContext db) => _db = db;

        public async Task<IEnumerable<Product>> SearchProductsAsync(string? q, int? categoryId, decimal? minPrice, decimal? maxPrice)
        {
            var query = _db.Products.Include(p => p.Category).AsQueryable();

            if (!string.IsNullOrWhiteSpace(q))
            {
                q = q.Trim().ToLower();
                query = query.Where(p => (p.Name ?? "").ToLower().Contains(q) || (p.Description ?? "").ToLower().Contains(q));
            }
            if (categoryId.HasValue)
                query = query.Where(p => p.CategoryId == categoryId.Value);
            if (minPrice.HasValue)
                query = query.Where(p => p.Price >= minPrice.Value);
            if (maxPrice.HasValue)
                query = query.Where(p => p.Price <= maxPrice.Value);

            return await query.OrderBy(p => p.Name).ToListAsync();
        }
    }
}
