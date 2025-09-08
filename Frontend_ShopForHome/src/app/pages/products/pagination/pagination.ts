// pagination.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  templateUrl: './pagination.html',
  styleUrls: ['./pagination.css'],
  imports: [CommonModule,]
})
export class PaginationComponent {
  @Input() totalItems: number = 0;   // total filtered products
  @Input() pageSize: number = 10;    // items per page
  @Input() currentPage: number = 1;  // current page
  @Output() pageChange = new EventEmitter<number>();

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.pageChange.emit(page); // emit new page to parent
  }

  
}
