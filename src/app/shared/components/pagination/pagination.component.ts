import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center gap-2" *ngIf="totalPages > 1">
      <!-- Previous Button -->
      <button 
        class="w-10 h-10 rounded-xl flex items-center justify-center transition-all border border-slate-200"
        [class.bg-white]="currentPage !== 1"
        [class.text-slate-600]="currentPage !== 1"
        [class.hover:border-indigo-600]="currentPage !== 1"
        [class.hover:text-indigo-600]="currentPage !== 1"
        [class.bg-slate-50]="currentPage === 1"
        [class.text-slate-300]="currentPage === 1"
        [class.cursor-not-allowed]="currentPage === 1"
        [disabled]="currentPage === 1" 
        (click)="onPageChange(currentPage - 1)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      <!-- Page Numbers -->
      <div class="flex items-center gap-1.5 mx-2">
        <ng-container *ngFor="let page of pages">
          <button
            class="w-10 h-10 rounded-xl font-bold text-sm transition-all"
            [class.bg-indigo-600]="page === currentPage"
            [class.text-white]="page === currentPage"
            [class.shadow-lg]="page === currentPage"
            [class.shadow-indigo-100]="page === currentPage"
            [class.text-slate-500]="page !== currentPage"
            [class.hover:bg-slate-100]="page !== currentPage"
            (click)="onPageChange(page)"
          >
            {{ page }}
          </button>
        </ng-container>
      </div>

      <!-- Next Button -->
      <button 
        class="w-10 h-10 rounded-xl flex items-center justify-center transition-all border border-slate-200"
        [class.bg-white]="currentPage !== totalPages"
        [class.text-slate-600]="currentPage !== totalPages"
        [class.hover:border-indigo-600]="currentPage !== totalPages"
        [class.hover:text-indigo-600]="currentPage !== totalPages"
        [class.bg-slate-50]="currentPage === totalPages"
        [class.text-slate-300]="currentPage === totalPages"
        [class.cursor-not-allowed]="currentPage === totalPages"
        [disabled]="currentPage === totalPages" 
        (click)="onPageChange(currentPage + 1)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </div>
  `
})
export class PaginationComponent {
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Output() pageChange = new EventEmitter<number>();

  get pages(): number[] {
    const range: number[] = [];
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, this.currentPage + 2);
    for (let i = start; i <= end; i++) range.push(i);
    return range;
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }
}
