using Microsoft.AspNetCore.Mvc;
using ShopForHome.Data;
using ShopForHome.Models;
using CsvHelper;
using System.Globalization;
using Microsoft.AspNetCore.Authorization;
using ShopForHome.Mappings;

namespace ShopForHome.Controllers.Api
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/[controller]")]
    public class BulkUploadController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BulkUploadController(AppDbContext context)
        {
            _context = context;
        }

        // POST: api/bulkupload
        [HttpPost]
public async Task<IActionResult> UploadProducts(IFormFile file)
{
    if (file == null || file.Length == 0)
        return BadRequest("No file uploaded.");

    using var reader = new StreamReader(file.OpenReadStream());
    using var csv = new CsvReader(reader, CultureInfo.InvariantCulture);
    csv.Context.RegisterClassMap<ProductMapBulkUpload>();
    var products = csv.GetRecords<Product>().ToList();

    // Validation
    foreach (var p in products)
    {
         if (!string.IsNullOrEmpty(p.ImagePath) && !p.ImagePath.StartsWith("assets/images/"))
    {
        p.ImagePath = $"assets/images/{p.ImagePath}";
    }
        if (string.IsNullOrWhiteSpace(p.Name) || p.Price <= 0 || p.StockQuantity < 0)
                    return BadRequest($"Invalid product data: {p.Name}");

        // Optional: check if Category exists
        if (!_context.Categories.Any(c => c.CategoryId == p.CategoryId))
            return BadRequest($"Category not found for product: {p.Name}");
    }

    // Set CreatedAt timestamp
    foreach (var p in products)
        p.CreatedAt = DateTime.Now;

    _context.Products.AddRange(products);
    await _context.SaveChangesAsync();

    return Ok(new { message = $"{products.Count} products uploaded successfully" });
}

    }
}
