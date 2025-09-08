import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Order } from '../../../models/order.model';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-order-card',
  standalone: true,
  templateUrl: './order-card.html',
  styleUrls: ['./order-card.css'],
  imports:[DatePipe,CurrencyPipe]
})
export class OrderCardComponent {
  @Input() order!: Order;
  @Output() viewDetails = new EventEmitter<Order>();

  onViewDetails() {
    this.viewDetails.emit(this.order);
  }
}
