export interface Coupon {
  id: number;
  code: string;
  description: string;
  discountPercentage: number;
  expiryDate: string;
  isActive: boolean;
}
