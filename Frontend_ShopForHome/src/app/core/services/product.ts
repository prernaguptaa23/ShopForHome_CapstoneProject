import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Product } from '../../models/product.model';
import { CartDto } from '../../models/cart.model';
import { map } from 'rxjs';
export interface Review {
  id: number;
  productId: number;
  userId: number;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = `${environment.apiUrl}/ProductsApi`;
  private apiUrlSearch = `${environment.apiUrl}/SearchApi`;
  private apiUrlCart =`${environment.apiUrl}/CartApi`;

  constructor(private http: HttpClient) { }

  /** Get all products */
  getAllProducts(): Observable<Product[]> {
  return this.http.get<Product[]>(`${this.apiUrl}/featured`);
}


  /** Get product by ID */
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  /** Create a new product (Admin only) */
createProduct(productData: FormData): Observable<Product> {
  return this.http.post<Product>(`${this.apiUrl}`, productData);
}

/** Update a product (Admin only) */
updateProduct(id: number, productData: FormData): Observable<Product> {
  return this.http.put<Product>(`${this.apiUrl}/${id}`, productData);
}


  /** Delete a product (Admin only) */
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /** Search products */
  searchProducts(
  searchTerm?: string,
  categoryId?: number,
  minPrice?: number,
  maxPrice?: number,
  page: number = 1,
  pageSize: number = 8
): Observable<{ items: Product[], totalCount: number }> {
  let params = `?page=${page}&pageSize=${pageSize}`;
  if (searchTerm) params += `&q=${searchTerm}`;
  if (categoryId) params += `&categoryId=${categoryId}`;
  if (minPrice) params += `&minPrice=${minPrice}`;
  if (maxPrice) params += `&maxPrice=${maxPrice}`;

  return this.http.get<{ items: Product[], totalCount: number }>(`${environment.apiUrl}/SearchApi${params}`);
}



  getProductReviews(productId: number): Observable<Review[]> {
  return this.http.get<Review[]>(`${this.apiUrl}/${productId}/reviews`);
}

getCategories() {
  return this.http.get<{ id: number; name: string }[]>(`${this.apiUrl}/category`);
}




  /** Get products with stock below a certain threshold (e.g., 10) */
getLowStockProducts(threshold: number = 10): Observable<Product[]> {
  return this.http.get<Product[]>(`${this.apiUrl}/lowStock?threshold=${threshold}`);
}

/** Get featured products (e.g., for home page carousel) */
getFeaturedProducts(): Observable<Product[]> {
  return this.http.get<Product[]>(`${this.apiUrl}/featured`);
}

getFilteredProducts(category: string, searchTerm: string, page: number, pageSize: number): Observable<{ items: Product[], totalCount: number }> {
  return this.http.get<{ items: Product[], totalCount: number }>(
    `${this.apiUrl}/filter?category=${category}&searchTerm=${searchTerm}&page=${page}&pageSize=${pageSize}`
  );
}
addToCart(productId: number, quantity: number = 1) {
  return this.http.post(`${this.apiUrlCart}/add?productId=${productId}&quantity=${quantity}`, {});
}

getMyCart() {
  return this.http.get<CartDto>(`${this.apiUrlCart}/me`);
}

removeFromCart(productId: number) {
  return this.http.delete(`${this.apiUrlCart}/remove?productId=${productId}`);
}






}


