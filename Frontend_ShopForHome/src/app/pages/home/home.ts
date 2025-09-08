import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../core/services/product';
import { Product } from '../../models/product.model';
import { CategoriesBannerComponent } from "./categories-banner/categories-banner";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  imports: [CategoriesBannerComponent, CommonModule, FormsModule]
})
export class HomeComponent implements OnInit {

  stats = [
    { number: '500+', label: 'Products' },
    { number: '2000+', label: 'Happy Customers' },
    { number: '1500+', label: 'Orders Delivered' }
  ];

  reviews = [
    { user: 'Alice', text: 'Great products with amazing quality!', location: 'New York' },
    { user: 'Bob', text: 'Fast delivery and excellent service.', location: 'California' },
    { user: 'Charlie', text: 'Amazing customer support and stylish furniture!', location: 'Texas' },
    { user: 'Diana', text: 'Loved the modern furniture designs.', location: 'Florida' }
  ];

  categories: string[] = []; // Example: ['Sofas', 'Decor', 'Lighting']

  constructor(private productService: ProductService, private router: Router) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  /** Load categories - can later fetch from backend */
  loadCategories() {
    this.categories = ['Sofa', 'Decor', 'Lighting'];
  }

  /** Redirect to product page with category filter */
  goToCategory(category: string) {
    this.router.navigate(['/products'], { queryParams: { category } });
  }

}
