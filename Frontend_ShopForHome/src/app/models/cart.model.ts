import { Product } from './product.model';

export interface CartItem {
  cartItemId: number;
  product: Product
  quantity: number;
  price: number;
}

export class Cart {
  id!: number;      // tells TS: trust me, this will be assigned
  userId!: number;
  items!: CartItem[];
  totalAmount!: number;
}

export interface CartItemDto {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  GST: number;
  finalPrice: number;
  imageUrl?: string;
  categoryId?: number;
  description?: string;
  stock?: number;
  createdAt?: string;
  updatedAt?: string;
}


export interface CartDto {
  cartId: number;
  userId: number;
  userName?: string;
  couponCode?: string;
  createdAt: string;
  items: CartItemDto[];
}

