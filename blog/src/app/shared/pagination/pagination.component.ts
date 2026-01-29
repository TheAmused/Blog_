import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav aria-label="Pagination Navigation" class="mt-4">
      <ul class="pagination justify-content-center gap-1">
        
        <li class="page-item" [class.disabled]="currentPage === 1">
          <button 
            class="page-link rounded-circle d-flex align-items-center justify-content-center" 
            style="width: 40px; height: 40px;"
            (click)="changePage(currentPage - 1)"
            [disabled]="currentPage === 1">
            <i class="bi bi-chevron-left"></i>
          </button>
        </li>

        @for (page of getPageNumbers(); track page) {
          <li class="page-item">
            <button 
              class="page-link rounded-circle d-flex align-items-center justify-content-center" 
              style="width: 40px; height: 40px;"
              [class.active]="page === currentPage"
              (click)="changePage(page)">
              {{ page }}
            </button>
          </li>
        }

        <li class="page-item" [class.disabled]="currentPage === totalPages">
          <button 
            class="page-link rounded-circle d-flex align-items-center justify-content-center" 
            style="width: 40px; height: 40px;"
            (click)="changePage(currentPage + 1)"
            [disabled]="currentPage === totalPages">
            <i class="bi bi-chevron-right"></i>
          </button>
        </li>
      </ul>
    </nav>
  `,
  styles: [`
    .page-link {
      cursor: pointer;
      color: var(--text-primary);
      background-color: var(--card-bg);
      border: none;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      transition: all 0.2s;
    }
    .page-link:hover:not(:disabled) {
      background-color: var(--border-color);
    }
    .page-link.active {
      background-color: var(--primary-color) !important;
      color: white !important;
    }
    .page-link:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class PaginationComponent {
  @Input() totalItems: number = 0;
  @Input() itemsPerPage: number = 5;
  @Input() currentPage: number = 1;
  @Output() pageChange = new EventEmitter<number>();

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage) || 1;
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    
    if (this.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, this.currentPage - 2);
      let endPage = Math.min(this.totalPages, startPage + 4);

      if (endPage - startPage < 4) {
        startPage = Math.max(1, endPage - 4);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }
}