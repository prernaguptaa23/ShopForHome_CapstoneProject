import { Order } from "./order.model";

describe('Order', () => {
  it('should create an instance', () => {
    const order = new Order(1, 101, [], 0, '2025-09-05', '123 Street, City','Pending');
    expect(order).toBeTruthy();
  });
});
