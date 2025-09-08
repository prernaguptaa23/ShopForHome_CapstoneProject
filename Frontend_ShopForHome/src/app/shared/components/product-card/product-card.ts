import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Product } from '../../../models/product.model';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../core/services/product';
import { CartService } from '../../../core/services/cart';
import { WishlistService } from '../../../core/services/wishlist';
@Component({
  selector: 'app-product-card',
  standalone: true,
  templateUrl: './product-card.html',
  styleUrls: ['./product-card.css'],
  imports: [ CommonModule,]
})
export class ProductCardComponent implements OnInit{
  @Input() product!: Product;
  @Output() addToCart = new EventEmitter<Product>();
  @Output() addToWishlist = new EventEmitter<Product>();

  @Input() isWishlisted: boolean = false;
@Output() toggleWishlist = new EventEmitter<Product>();

  categories: { id: number; name: string }[] = [];
  constructor(private productService: ProductService,private cartService: CartService, private wishlistService: WishlistService) {}

  ngOnInit(): void {
      console.log('Product in card:', this.product);
 // Map imagePath to imageUrl if imageUrl is missing
   if (!this.product.imageUrl && (this.product as any).imagePath) {
    this.product.imageUrl = (this.product as any).imagePath;
  }

    this.productService.getCategories().subscribe(res => this.categories = res);
  console.log('Product input:', this.product);
// Check if product is already in wishlist
  if(this.product?.productId) {
    // 🔄 listen to wishlist updates
    this.wishlistService.wishlistCount.subscribe(() => {
      this.isWishlisted = this.wishlistService.isInWishlist(this.product.productId);
    });
  }
  }

  onToggleWishlist() {
      console.log('Toggling wishlist for:', this.product);
  if (this.isWishlisted) {
    const item = this.wishlistService.wishlistItems
      .find(w => w.productId === this.product.productId);
    if (item) {
      this.wishlistService.removeFromWishlist(item.wishlistId).subscribe({
        next: () => {
          this.isWishlisted = false;
          console.log('❌ Removed from wishlist');
        },
        error: (err) => {
          console.error('Error adding to wishlist', err);
          alert('Failed to add to wishlist. Make sure you are logged in.');
        }
      });
    }
  } else {
    this.wishlistService.addToWishlist(this.product.productId).subscribe({
      next: () => {
        this.isWishlisted = true;
        console.log('✅ Added to wishlist');
      },
      error:  (err: any)  => console.error('Error adding to wishlist', err)
    });
  }
}

  getCategoryName(id: number): string {
    const cat = this.categories.find(c => c.id === id);
    return cat ? cat.name : 'Unknown';
  }

onAddToCart() {
  if (!this.product?.productId) {
    console.error('Product ID is undefined!', this.product);
    return;
  }

  this.cartService.addToCart(this.product.productId, 1).subscribe({
    next: () => {
      console.log('✅ Added to cart');
      this.cartService.updateCartCount();
    },
    error: (err) => console.error('❌ Error adding to cart:', err)
  });
}


}
