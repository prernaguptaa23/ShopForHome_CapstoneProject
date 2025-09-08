import { Component, OnInit } from '@angular/core';
import { WishlistService } from '../../../core/services/wishlist';
import { CartService } from '../../../core/services/cart';
import { Wishlist } from '../../../models/wishlist.model';
import { ProductCardComponent } from "../../../shared/components/product-card/product-card";
import { LoaderComponent } from "../../../shared/components/loader/loader";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-wishlist-items',
  standalone: true,
  templateUrl: './wishlist-items.html',
  styleUrls: ['./wishlist-items.css'],
  imports: [ProductCardComponent, LoaderComponent, FormsModule, ReactiveFormsModule, CommonModule]
})
export class WishlistItemsComponent implements OnInit {

  wishlistItems$!: Observable<Wishlist[]>;
  loading: boolean = true;
  errorMessage: string = '';

  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    // Fetch wishlist from service
    this.wishlistItems$ = this.wishlistService.getWishlist();
  }

  /** Add product to cart */
  addToCart(productId: number) {
    this.cartService.addToCart(productId, 1).subscribe({
      next: () => this.cartService.updateCartCount(),
      error: err => console.error('Error adding to cart', err)
    });
  }

loadWishlist() {
    this.loading = true;
    this.wishlistItems$ = this.wishlistService.getWishlist();
    this.wishlistItems$.subscribe({
      next: () => this.loading = false,
      error: (err: any) => {
        console.error(err);
        this.errorMessage = 'Failed to load wishlist.';
        this.loading = false;
      }
    });
  }
  
/** Remove item from wishlist */
  removeFromWishlist(wishlistId: number) {
    this.wishlistService.removeFromWishlist(wishlistId).subscribe({
      next: () => {
        // Refresh the Observable so page updates automatically
        this.loadWishlist();
      },
      error: (err: any) => {
        console.error(err);
        this.errorMessage = 'Failed to remove item.';
      }
    });
  }


  /** Check if product is in wishlist */
  isInWishlist(productId: number): boolean {
    return this.wishlistService.isInWishlist(productId);
  }
}
