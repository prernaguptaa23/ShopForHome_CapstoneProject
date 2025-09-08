export interface Product {
  productId: number;
  name: string;
  description: string;
  price: number;
  discountedPrice?: number;
  stock: number;          
  imageUrl: string;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
}
