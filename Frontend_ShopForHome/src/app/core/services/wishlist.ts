import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Wishlist } from '../../models/wishlist.model';
import { Product } from '../../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  private apiUrl = `${environment.apiUrl}/wishlist`;

  // ✅ State
  public wishlistItems: Wishlist[] = [];
  public wishlistCount: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  /** Fetch wishlist from backend and map to Wishlist model */
  getWishlist(): Observable<Wishlist[]> {
    return this.http.get<any[]>(`${this.apiUrl}/me`, { headers: this.getHeaders() }).pipe(
      map(items => {
        const mapped: Wishlist[] = items.map(item => ({
          wishlistId: item.wishlistId,
          productId: item.productId,
          userId: item.userId || 0,
          createdAt: item.createdAt || new Date().toISOString(),
          product: {
            productId: item.productId,
            name: item.name || 'No Name',
            description: item.description || '',
            price: item.price || 0,
            imageUrl: item.imagePath || 'assets/default.png',
            stock: item.stockQuantity || 0,
            categoryId: item.categoryId || 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          } as Product
        }));
        this.wishlistItems = mapped;
        this.updateWishlistCount(mapped.length);
        return mapped;
      })
    );
  }

  /** Add product to wishlist */
  addToWishlist(productId: number): Observable<Wishlist> {
    return this.http.post<Wishlist>(
      `${this.apiUrl}/add`,
      { productId },
      { headers: this.getHeaders() }
    ).pipe(
      map(item => {
        // Update local state
        const mapped: Wishlist = {
          wishlistId: item.wishlistId,
          productId: item.productId,
          userId: item.userId,
          createdAt: item.createdAt,
          product: item.product
        } as Wishlist;
        this.wishlistItems.push(mapped);
        this.updateWishlistCount(this.wishlistItems.length);
        return mapped;
      })
    );
  }

  /** Remove product from wishlist */
  removeFromWishlist(wishlistId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove/${wishlistId}`, { headers: this.getHeaders() }).pipe(
      map(() => {
        this.wishlistItems = this.wishlistItems.filter(w => w.wishlistId !== wishlistId);
        this.updateWishlistCount(this.wishlistItems.length);
      })
    );
  }

  /** Check if product is in wishlist */
  isInWishlist(productId: number): boolean {
    return this.wishlistItems.some(item => item.productId === productId);
  }

  /** Update wishlist count */
  updateWishlistCount(count: number): void {
    this.wishlistCount.next(count);
  }
}
