import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-pagination',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="pagination" *ngIf="totalPages > 1">
      <button class="page-btn" [disabled]="currentPage === 1" (click)="onPageChange(currentPage - 1)">
        ‹
      </button>

      <ng-container *ngFor="let page of pages">
        <button
          class="page-btn"
          [class.active]="page === currentPage"
          (click)="onPageChange(page)"
        >
          {{ page }}
        </button>
      </ng-container>

      <button class="page-btn" [disabled]="currentPage === totalPages" (click)="onPageChange(currentPage + 1)">
        ›
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
