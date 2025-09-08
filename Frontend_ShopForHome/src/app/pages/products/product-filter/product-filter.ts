import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product';
@Component({
  selector: 'app-product-filter',
  standalone: true,
  templateUrl: './product-filter.html',
  styleUrls: ['./product-filter.css'],
  imports: [CommonModule, FormsModule]
})
export class ProductFilterComponent implements OnInit {

  @Output() filterChanged = new EventEmitter<any>();

  categories: { id: number; name: string }[] = [];


  selectedCategoryId?: number; // changed to number
  searchTerm: string = '';
  minPrice?: number;
  maxPrice?: number;

  constructor(private productService: ProductService) {}

 ngOnInit() {
    this.productService.getCategories().subscribe(res => {
});

  }
  applyFilter() {
    this.filterChanged.emit({
      categoryId: this.selectedCategoryId,
      searchTerm: this.searchTerm,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice
    });
  }
}
