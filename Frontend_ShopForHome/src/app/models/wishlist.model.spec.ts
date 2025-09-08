import { Wishlist } from './wishlist.model';

describe('Wishlist', () => {
  it('should create an instance', () => {
    const wishlist: Wishlist = {
      id: 1,
      userId: 1,
      items: [
        {
          id: 1,
          product: {
            id: 101,
            name: 'Test Product',
            description: 'Test description',
            price: 100,
            discountedPrice: 90,
            stock:50,
            imageUrl: 'test.jpg',
            categoryId: 1,
            createdAt: '2025-09-05',
            updatedAt: '2025-09-05'
          },
          createdAt: '2025-09-05'
        }
      ]
    };

    expect(wishlist).toBeTruthy();
  });
});
