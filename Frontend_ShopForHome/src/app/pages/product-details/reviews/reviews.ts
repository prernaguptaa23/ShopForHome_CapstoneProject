import { Component, Input, OnInit } from '@angular/core';
import { ProductService } from '../../../core/services/product';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reviews',
  standalone: true,
  templateUrl: './reviews.html',
  styleUrls: ['./reviews.css'],
  imports: [CommonModule]
})
export class ReviewsComponent implements OnInit {
  @Input() productId!: number;
  reviews: any[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews() {
    this.productService.getProductReviews(this.productId).subscribe(res => {
      this.reviews = res;
    });
  }
}
