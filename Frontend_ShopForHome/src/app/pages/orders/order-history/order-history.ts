import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../core/services/order';
import { Order } from '../../../models/order.model';
import { LoaderComponent } from "../../../shared/components/loader/loader";
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-order-history',
  standalone: true,
  templateUrl: './order-history.html',
  styleUrls: ['./order-history.css'],
  imports: [LoaderComponent, CurrencyPipe, DatePipe, CommonModule]
})
export class OrderHistoryComponent implements OnInit {
  orders: Order[] = [];
  loading: boolean = true;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.orderService.getUserOrders().subscribe({
      next: (res) => {
        this.orders = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching orders:', err);
        this.loading = false;
      }
    });
  }

  viewOrderDetails(orderId: number): void {
    // Navigate to order-details page
    // Can use router.navigate(['/orders', orderId])
  }
}
