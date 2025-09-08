import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Order } from '../../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = `${environment.apiUrl}/OrdersApi`;

  constructor(private http: HttpClient) { }

  /** Place a new order */
  placeOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/create`, order);
  }

  /** Get all orders of a user */
  getUserOrders(userId?: number): Observable<Order[]> {
  let url = `${this.apiUrl}/user`;
  if (userId) url += `/${userId}`;
  return this.http.get<Order[]>(url);
}


  /** Get details of a specific order */
  getOrderById(orderId: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/getById/${orderId}`);
  }

  /** Cancel an order */
  cancelOrder(orderId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/cancel/${orderId}`);
  }
}
