import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../core/services/product';
import { Product } from '../../../models/product.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stock-alerts',
  standalone: true,
  templateUrl: './stock-alerts.html',
  styleUrls: ['./stock-alerts.css'],
  imports: [ FormsModule , CommonModule]
})
export class StockAlertsComponent implements OnInit {
  lowStockProducts: Product[] = [];
  errorMessage = '';

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.loadLowStockProducts();
  }

  loadLowStockProducts() {
    this.productService.getLowStockProducts().subscribe({
      next: res => this.lowStockProducts = res,
      error: () => this.errorMessage = 'Failed to load low stock products.'
    });
  }

  notifyAdmin(product: Product) {
    alert(`Notify: Low stock for ${product.name}. Current stock: ${product.stock}`);
    // You can later integrate email/notification API
  }
}
