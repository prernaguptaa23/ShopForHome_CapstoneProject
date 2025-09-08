import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../core/services/product';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
  imports: [RouterModule, CommonModule]
})
export class NavbarComponent implements OnInit {
  categories: string[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getCategories().subscribe((data: any[]) => {
      this.categories = data.map(c => c.name);
    });
  }
}
