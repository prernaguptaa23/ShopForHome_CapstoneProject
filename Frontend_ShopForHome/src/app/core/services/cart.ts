import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable , BehaviorSubject} from 'rxjs';
import { Cart, CartDto } from '../../models/cart.model';
import { CartItem } from '../../models/cart.model';
import { ProductService } from './product';
@Injectable({
  providedIn: 'root'
})
export class CartService {

  private apiUrl = `${environment.apiUrl}/CartApi`;

    public cartCount: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCount.asObservable();


  constructor(private http: HttpClient, private productService: ProductService) { }

  /** Get user's cart */
getCart(): Observable<CartDto> {
  const token = localStorage.getItem('token');
  return this.http.get<CartDto>(`${this.apiUrl}/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
}


  /** Add product to cart */
  addToCart(productId: number, quantity: number = 1) {
  const token = localStorage.getItem('token');
  return this.http.post(
    `${this.apiUrl}/add?productId=${productId}&quantity=${quantity}`, // ✅ send params
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
}


  /** Update cart item quantity */
 updateCartCount() {
  this.productService.getMyCart().subscribe({
    next: (cart: CartDto) => this.cartCount.next(cart.items.length),
    error: () => this.cartCount.next(0)
  });
}


  /** Remove item from cart */
  removeCartItem(cartItemId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove`);
  }

  /** Clear entire cart for user */
  clearCart(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/clear/${userId}`);
  }


}
