import { Component, Input } from '@angular/core';
import { Coupon } from '../../../models/coupon.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-coupon-card',
  standalone: true,
  templateUrl: './coupon-card.html',
  styleUrls: ['./coupon-card.css'],
  imports:[DatePipe]
})
export class CouponCardComponent {
  @Input() coupon!: Coupon;
}
