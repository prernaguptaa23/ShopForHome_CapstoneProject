using Microsoft.EntityFrameworkCore;
using ShopForHome.Data;
using ShopForHome.Models;

namespace ShopForHome.Services
{
    public class ReportService
    {
        private readonly AppDbContext _db;
        public ReportService(AppDbContext db) => _db = db;

        // Simple sales report: total sales and count grouped by day between dates
        public async Task<IEnumerable<SalesReportDto>> GetSalesReportAsync(DateTime from, DateTime to)
        {
            var query = _db.Orders
                .Where(o => o.CreatedAt >= from && o.CreatedAt <= to && o.Status == "Completed")
                .GroupBy(o => o.CreatedAt.Date)
                .Select(g => new SalesReportDto
                {
                    Date = g.Key,
                    OrdersCount = g.Count(),
                    TotalRevenue = g.Sum(o => o.GrandTotal)
                })
                .OrderBy(r => r.Date);

            return await query.ToListAsync();
        }
    }

    public class SalesReportDto
    {
        public DateTime Date { get; set; }
        public int OrdersCount { get; set; }
        public decimal TotalRevenue { get; set; }
    }
}
