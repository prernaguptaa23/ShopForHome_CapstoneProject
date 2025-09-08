using CsvHelper.Configuration;
using ShopForHome.Models; // Make sure to include your Product model namespace

namespace ShopForHome.Mappings // Use the folder/namespace you prefer
{
    public class ProductMapBulkUpload : ClassMap<Product>
    {
        public ProductMapBulkUpload()
        {
            Map(m => m.Name);
            Map(m => m.Description);
            Map(m => m.Price);
            Map(m => m.StockQuantity);
            Map(m => m.GST);
            Map(m => m.CategoryId);
            Map(m => m.ImagePath);

            // Ignore properties not in CSV
            Map(m => m.ProductId).Ignore();
            Map(m => m.CreatedAt).Ignore();
            Map(m => m.UpdatedAt).Ignore();
            Map(m => m.Category).Ignore();
        }
    }
}
