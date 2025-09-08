import { Cart } from './cart.model';

describe('Cart', () => {
  it('should create an instance', () => {
    const cart: Cart = {
      id: 1,
      userId: 1,
      items: [],
      totalAmount: 0
    };
    expect(cart).toBeTruthy();
  });
});
