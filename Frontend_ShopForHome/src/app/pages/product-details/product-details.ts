import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../core/services/product';
import { Product } from '../../models/product.model';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ReviewsComponent } from "./reviews/reviews";
import { CartService } from '../../core/services/cart';
import { WishlistService } from '../../core/services/wishlist';
import { CartItem } from '../../models/cart.model';
import { AccountService } from '../../core/services/account';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-product-details',
  standalone: true,
  templateUrl: './product-details.html',
  styleUrls: ['./product-details.css'],
  imports: [CurrencyPipe, ReviewsComponent, CommonModule]
})
export class ProductDetailsComponent implements OnInit {
  product: Product | null = null;

  constructor(
     private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService,
      private accountService: AccountService,

  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.productService.getProductById(+productId).subscribe(res => {
        this.product = res;
      });
    }
  }

  addToCart(product: Product): void {
  const cartItem: CartItem = {
    cartItemId: 0,      // placeholder, backend will assign actual ID
    product: product,   // pass the full Product object
    quantity: 1,
    price: product.price
  };

    this.cartService.addToCart(cartItem.product.productId);
}
async addToWishlist(product: Product) {
  const user = await firstValueFrom(this.accountService.currentUser);
  if (!user) return;

  const wishlistItem = { userId: user.id, productId: product.productId };

  this.wishlistService.addToWishlist(product.productId).subscribe({
    next: () => alert(`${product.name} added to wishlist!`),
    error: () => alert(`Failed to add ${product.name} to wishlist.`)
  });
}
}
