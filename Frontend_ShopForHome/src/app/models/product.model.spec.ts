import { Product } from "./product.model";

describe('Product', () => {
  it('should create an instance', () => {
    const product: Product = {
      id: 1,
      name: 'Sample Product',
      description: 'This is a test product',
      price: 100,
      discountedPrice: 80,
      stock:50,
      imageUrl: 'https://example.com/image.jpg',
      categoryId: 1,
      createdAt: '2025-09-05',
      updatedAt: '2025-09-05'
    };
    expect(product).toBeTruthy();
  });
});
