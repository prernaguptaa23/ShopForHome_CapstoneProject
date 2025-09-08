using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShopForHome.Services;

namespace ShopForHome.Controllers.Api
{
    [AllowAnonymous]
    [ApiController]
    [Route("api/[controller]")]
    public class SearchApiController : ControllerBase
    {
        private readonly SearchService _searchService;
        public SearchApiController(SearchService searchService) => _searchService = searchService;

        // GET api/search?q=lamp&categoryId=2&minPrice=100&maxPrice=5000
        [HttpGet]
public async Task<IActionResult> Get(
    [FromQuery] string? q, 
    [FromQuery] int? categoryId, 
    [FromQuery] decimal? minPrice, 
    [FromQuery] decimal? maxPrice,
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 8)
{
    var results = await _searchService.SearchProductsAsync(q, categoryId, minPrice, maxPrice);

    var totalCount = results.Count();

    var pagedResults = results
        .Skip((page - 1) * pageSize)
        .Take(pageSize)
        .ToList();

    return Ok(new { items = pagedResults, totalCount });
}

    }
}
