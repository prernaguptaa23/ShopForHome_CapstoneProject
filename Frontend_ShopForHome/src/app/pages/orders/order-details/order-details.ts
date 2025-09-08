import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../../core/services/order';
import { Order } from '../../../models/order.model';
import { LoaderComponent } from "../../../shared/components/loader/loader";
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-order-details',
  standalone: true,
  templateUrl: './order-details.html',
  styleUrls: ['./order-details.css'],
  imports: [LoaderComponent, DatePipe, CurrencyPipe, CommonModule]
})
export class OrderDetailsComponent implements OnInit {
  orderId!: number;
  order!: Order | null;
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.orderId = +params['id'];
      this.fetchOrderDetails();
    });
  }

  fetchOrderDetails(): void {
    this.orderService.getOrderById(this.orderId).subscribe({
      next: (res) => {
        this.order = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching order details:', err);
        this.loading = false;
      }
    });
  }
}
