import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, LowerCasePipe } from '@angular/common';

@Component({
  selector: 'app-categories-banner',
  standalone: true,
  templateUrl: './categories-banner.html',
  styleUrls: ['./categories-banner.css'],
  imports: [LowerCasePipe, CommonModule]
})
export class CategoriesBannerComponent implements OnInit {
  categories: string[] = ['Furniture', 'Decor', 'Lighting'];

  constructor(private router: Router) { }

  ngOnInit(): void { }

  goToCategory(category: string) {
    this.router.navigate(['/products'], { queryParams: { category } });
  }
}
