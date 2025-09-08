using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopForHome.Data;
using ShopForHome.Models;
using ShopForHome.Models.DTOs;

namespace ShopForHome.Controllers.ApiControllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsApiController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductsApiController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/products
        [HttpGet("featured")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetProducts()
        {
            var products = await _context.Products
                .Include(p => p.Category)
                .Select(p => new ProductDto
                {
                    ProductId = p.ProductId,
                    Name = p.Name,
                    Description = p.Description,
                    Price = p.Price,
                    ImagePath = p.ImagePath,
                    StockQuantity = p.StockQuantity,
                    GST = p.GST,
                    CategoryId = p.CategoryId,
                    CategoryName = p.Category!.Name
                })
                .ToListAsync();

            return Ok(products);
        }

        // GET: api/products/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<ProductDto>> GetProduct(int id)
        {
            var product = await _context.Products
                .Include(p => p.Category)
                .Where(p => p.ProductId == id)
                .Select(p => new ProductDto
                {
                    ProductId = p.ProductId,
                    Name = p.Name,
                    Description = p.Description,
                    Price = p.Price,
                    ImagePath = p.ImagePath,
                    StockQuantity = p.StockQuantity,
                    GST = p.GST,
                    CategoryId = p.CategoryId,
                    CategoryName = p.Category!.Name
                })
                .FirstOrDefaultAsync();

            if (product == null) return NotFound();
            return Ok(product);
        }

        
[HttpGet("category")]
[AllowAnonymous]
public IActionResult GetCategories()
{
    var categories = _context.Categories
        .Select(c => new { id = c.CategoryId, name = c.Name })
        .ToList();
    return Ok(categories);
}




        // GET: api/products/category/2
        [HttpGet("category/{categoryId}")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetByCategoryId(int categoryId)
        {
            var products = await _context.Products
                .Include(p => p.Category)
                .Where(p => p.CategoryId == categoryId)
                .Select(p => new ProductDto
                {
                    ProductId = p.ProductId,
                    Name = p.Name,
                    Description = p.Description,
                    Price = p.Price,
                    ImagePath = p.ImagePath,
                    StockQuantity = p.StockQuantity,
                    GST = p.GST,
                    CategoryId = p.CategoryId,
                    CategoryName = p.Category!.Name
                })
                .ToListAsync();

            return Ok(products);
        }

        

        // POST: api/products
        [HttpPost]
        [Authorize(Roles="Admin")]
        public async Task<ActionResult<ProductDto>> AddProduct([FromBody] ProductCreateDto createDto)
        {
            var category = await _context.Categories.FindAsync(createDto.CategoryId);
            if (category == null) return BadRequest("Invalid categoryId");

            var product = new Product
            {
                Name = createDto.Name,
                Description = createDto.Description,
                Price = createDto.Price,
                ImagePath = createDto.ImagePath,
                StockQuantity = createDto.StockQuantity,
                GST = createDto.GST,
                CategoryId = createDto.CategoryId,
                CreatedAt = DateTime.UtcNow
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            var productDto = new ProductDto
            {
                ProductId = product.ProductId,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                ImagePath = product.ImagePath,
                StockQuantity = product.StockQuantity,
                GST = product.GST,
                CategoryId = product.CategoryId,
                CategoryName = category.Name
            };

            return CreatedAtAction(nameof(GetProduct), new { id = product.ProductId }, productDto);
        }

        // PUT: api/products/5
        [HttpPut("{id}")]
        [Authorize(Roles="Admin")]
        public async Task<IActionResult> UpdateProduct(int id, [FromBody] ProductCreateDto updateDto)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();

            var category = await _context.Categories.FindAsync(updateDto.CategoryId);
            if (category == null) return BadRequest("Invalid categoryId");

            product.Name = updateDto.Name;
            product.Description = updateDto.Description;
            product.Price = updateDto.Price;
            product.ImagePath = updateDto.ImagePath;
            product.StockQuantity = updateDto.StockQuantity;
            product.GST = updateDto.GST;
            product.CategoryId = updateDto.CategoryId;
            product.UpdatedAt = DateTime.UtcNow;

            _context.Entry(product).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/products/5
        [HttpDelete("{id}")]
        [Authorize(Roles="Admin")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
