export interface OrderItem {
  id: number;
  product: any; // can use Product interface
  quantity: number;
  price: number;
}

export class Order {
  constructor(
    public id: number,
    public userId: number,
    public items: OrderItem[],
    public totalAmount: number,
    public orderDate: string,
    public shippingAddress: string,   // add if API provides
    public paymentstatus: string
  ) {}
}