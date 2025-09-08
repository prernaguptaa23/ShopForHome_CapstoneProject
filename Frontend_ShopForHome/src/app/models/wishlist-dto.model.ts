export interface WishlistDto {
  wishlistId: number;
  productId: number;
  name: string;
  description: string;
  price: number;
  imagePath: string;
  stockQuantity?: number;
}
