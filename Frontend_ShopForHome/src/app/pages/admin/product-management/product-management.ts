import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../../core/services/product';
import { Product } from '../../../models/product.model';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-management',
  standalone: true,
  templateUrl: './product-management.html',
  styleUrls: ['./product-management.css'],
  imports: [CurrencyPipe, FormsModule, ReactiveFormsModule, CommonModule]
})
export class ProductManagementComponent implements OnInit {
  products: Product[] = [];
  productForm: FormGroup;
  editMode = false;
  selectedProductId: number | null = null;
  submitted = false;
  successMessage = '';
  errorMessage = '';
  imageFile: File | null = null;
  currentPage: number = 1;
pageSize: number = 10;
totalProducts: number = 0;



  constructor(private fb: FormBuilder, private productService: ProductService) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(1)]],
      stock: ['', [Validators.required, Validators.min(0)]],
      image: [null]
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  get f() { return this.productForm.controls; }

  loadProducts() {
  this.productService.getAllProducts().subscribe({
    next: (data) => {
      this.products = data;      // ✅ directly list
      this.totalProducts = data.length;
    },
    error: (err) => console.error('Error loading products', err)
  });
  
}

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length) {
      this.imageFile = event.target.files[0];
    }
  }

  onSubmit() {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.productForm.invalid) return;

    const formData = new FormData();
    formData.append('name', this.productForm.value.name);
    formData.append('description', this.productForm.value.description);
    formData.append('price', this.productForm.value.price);
    formData.append('stock', this.productForm.value.stock);
    if (this.imageFile) formData.append('image', this.imageFile);

    if (this.editMode && this.selectedProductId) {
      this.productService.updateProduct(this.selectedProductId, formData).subscribe({
        next: () => {
          this.successMessage = 'Product updated successfully!';
          this.loadProducts();
          this.cancelEdit();
        },
        error: () => this.errorMessage = 'Failed to update product.'
      });
    } else {
      this.productService.createProduct(formData).subscribe({
        next: () => {
          this.successMessage = 'Product added successfully!';
          this.loadProducts();
          this.productForm.reset();
          this.imageFile = null;
        },
        error: () => this.errorMessage = 'Failed to add product.'
      });
    }
  }

  editProduct(product: Product) {
    this.editMode = true;
    this.selectedProductId = product.productId;
    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock
    });
  }

  deleteProduct(productId: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(productId).subscribe({
        next: () => this.loadProducts(),
        error: () => this.errorMessage = 'Failed to delete product.'
      });
    }
  }

  cancelEdit() {
    this.editMode = false;
    this.selectedProductId = null;
    this.productForm.reset();
    this.imageFile = null;
  }
}
