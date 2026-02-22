import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-job-stats',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="stats-bar" *ngIf="total > 0">
      <div class="stat-item">
        <span class="stat-value">{{ total }}</span>
        <span class="stat-label">offres trouvées</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{{ currentPage }}</span>
        <span class="stat-label">page actuelle</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{{ totalPages }}</span>
        <span class="stat-label">pages au total</span>
      </div>
    </div>
  `,
    styles: [`
    .stats-bar {
      display: flex;
      gap: 2rem;
      align-items: center;
      padding: 0.75rem 1.25rem;
      background: var(--card);
      border-radius: var(--radius);
      border: 1px solid var(--border);
      margin-bottom: 1.25rem;
      flex-wrap: wrap;
    }
    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .stat-value {
      font-size: 1.2rem;
      font-weight: 700;
      color: var(--primary);
    }
    .stat-label {
      font-size: 0.75rem;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    @media (max-width: 480px) {
      .stats-bar { gap: 1rem; }
    }
  `]
})
export class JobStatsComponent {
    @Input() total = 0;
    @Input() currentPage = 1;
    @Input() totalPages = 1;
}
