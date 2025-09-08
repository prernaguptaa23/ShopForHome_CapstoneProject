import { Component, OnInit } from '@angular/core';
import { CartService } from '../../core/services/cart';
import { CartItem } from '../../models/cart.model';
import { Product } from '../../models/product.model';
import { CartItemsComponent } from "./cart-items/cart-items";
import { CartSummaryComponent } from "./cart-summary/cart-summary";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.html',
  styleUrls: ['./cart.css'],
  imports: [CartItemsComponent, CartSummaryComponent,CommonModule, FormsModule,]
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];

  constructor(private cartService: CartService) {}

  ngOnInit() {
  this.loadCart();
}

  
loadCart() {
  this.cartService.getCart().subscribe({
    next: (cart) => {
      // Make sure cart is typed as CartDto
      if (cart && cart.items) {
        this.cartItems = cart.items.map(item => ({
  cartItemId: item.productId,   // or item.cartItemId if backend gives it
  product: {
    productId: item.productId,
    name: item.productName,
    price: item.price,
    imageUrl: item.imageUrl || 'assets/default.png', // fallback image
    categoryId: item.categoryId || 0,  // backend may or may not send
    GST: item.GST,
    description: item.description || '', // required in Product model
    stock: item.stock || 0,              // required in Product model
    createdAt: item.createdAt || '',     // required in Product model
    updatedAt: item.updatedAt || ''      // required in Product model
  } as Product,
  quantity: item.quantity,
  price: item.price
}));
      } else {
        this.cartItems = [];
      }
    },
    error: () => this.cartItems = []
  });
}


  onUpdateItem(item: CartItem) {
  this.cartService.addToCart(item.product.productId, item.quantity).subscribe({
    next: () => this.cartService.updateCartCount(),
    error: err => console.error(err)
  });
}


  onRemoveItem(productId: number) {
    this.cartService.removeCartItem(productId).subscribe({
      next: () => {
        this.cartItems = this.cartItems.filter(i => i.product.productId !== productId);
        this.cartService.updateCartCount();
      },
      error: err => console.error(err)
    });
  }

  checkout() {
    alert('Checkout functionality coming soon!');
  }
}
