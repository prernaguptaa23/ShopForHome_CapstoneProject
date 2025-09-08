import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../core/services/product';
import { Product } from '../../../models/product.model';
import { ProductCardComponent } from "../../../shared/components/product-card/product-card";
import { ProductFilterComponent } from "../product-filter/product-filter";
import { PaginationComponent } from "../pagination/pagination";
import { CommonModule } from '@angular/common';
import { CartService } from '../../../core/services/cart';

@Component({
  selector: 'app-product-list',
  standalone: true,
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.css'],
  imports: [ProductCardComponent, ProductFilterComponent, PaginationComponent, CommonModule,]
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  categories: string[] =[];
  currentPage: number = 1;
  pageSize: number = 8;   // 8 products per page
  totalProducts: number = 0;
  lastFilter: any ={};

  constructor(private productService: ProductService, private cartService: CartService) { }

  ngOnInit(): void {
    this.loadProducts();
  }


  loadProducts() {
  this.productService.getAllProducts().subscribe({
    next: (data) => {
      this.products = data;      // ✅ directly list
      this.totalProducts = data.length;
    },
    error: (err) => console.error('Error loading products', err)
  });
  
}



applyFilter(filter: any) {
  this.lastFilter = filter; // store current filter
  this.productService.searchProducts(
    filter.searchTerm,
    filter.categoryId,
    filter.minPrice,
    filter.maxPrice,
    this.currentPage,
    this.pageSize
  ).subscribe({
    next: (data) => {
      this.products = data.items;      // products for current page
      this.totalProducts = data.totalCount; // total for pagination
    },
    error: (err) => console.error('Error fetching filtered products', err)
  });
}

pageChanged(newPage: number) {
  this.currentPage = newPage;
  this.applyFilter(this.lastFilter); // re-fetch products for new page
}

handleAddToCart(productId: number) {
    this.cartService.addToCart(productId, 1).subscribe({
      next: () => {
        this.cartService.updateCartCount(); // ✅ refresh badge
      },
      error: (err) => console.error(err)
    });
  }


}
