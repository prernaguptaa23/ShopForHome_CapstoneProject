import { Component, Input } from '@angular/core';
import { CartItem } from '../../../models/cart.model';
import { CurrencyPipe } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../../../core/services/cart';
@Component({
  selector: 'app-cart-summary',
  standalone: true,
  templateUrl: './cart-summary.html',
  styleUrls: ['./cart-summary.css'],
  imports: [CurrencyPipe]
})
export class CartSummaryComponent {
  @Input() items: CartItem[] = [];

    userId: number = Number(localStorage.getItem('userId'));

      constructor(private http: HttpClient, private cartService: CartService) {}

  get subtotal(): number {
    return this.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }

  get discount(): number {
    return this.subtotal * 0.05; 
  }

  get total(): number {
    return this.subtotal - this.discount;
  }

  checkout() {
    const orderDto = {
      items: this.items.map((ci: CartItem) => ({
        productId: ci.product.productId,
        quantity: ci.quantity
      })),
      couponCode: null
    };

    this.http.post(`${environment.apiUrl}/OrdersApi`, orderDto, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).subscribe({
      next: () => {
        alert('Order placed successfully!');
        this.cartService.clearCart(this.userId).subscribe(() => {
          this.cartService.updateCartCount();
        });
      },
      error: (err: any) => alert(err.error || 'Failed to place order')
    });
  }
}
