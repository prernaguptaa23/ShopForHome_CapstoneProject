import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../core/services/product';
import { Product } from '../../../models/product.model';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-featured-products',
  standalone: true,
  templateUrl: './featured-products.html',
  styleUrls: ['./featured-products.css'],
  imports: [ CommonModule,]
})
export class FeaturedProductsComponent implements OnInit {

  featuredProducts: Product[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.loadFeaturedProducts();
  }

  loadFeaturedProducts() {
    this.productService.getFeaturedProducts().subscribe({
      next: (data) => this.featuredProducts = data,
      error: (err) => console.error('Error loading featured products', err)
    });
  }
addToCart(product: Product) {
  this.productService.addToCart(product.productId).subscribe({
  next: () => alert(`${product.name} added to cart!`),
  error: (err) => console.error('Add to cart failed', err)
});

}

}


