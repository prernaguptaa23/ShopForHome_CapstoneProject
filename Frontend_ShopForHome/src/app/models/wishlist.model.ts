import { Product } from './product.model';

export interface Wishlist {
  wishlistId: number;   // matches backend property
  userId: number;
  productId: number;
  createdAt: string;
  product: Product;    // navigation property from backend include
}
