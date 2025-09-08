import { Coupon } from './coupon.model';

describe('Coupon', () => {
  it('should create an instance', () => {
    const coupon: Coupon = {
      id: 1,
      code: 'SAVE10',
      description: '10% off on all products',
      discountPercentage: 10,
      expiryDate: '2025-12-31',
      isActive: true
    };
    expect(coupon).toBeTruthy();
  });
});
