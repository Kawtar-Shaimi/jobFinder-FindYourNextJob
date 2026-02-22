import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

/**
 * Dashboard summary card component.
 * Displays a single stat (icon + value + label) on the dashboard.
 */
@Component({
    selector: 'app-stat-card',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="stat-card card" [routerLink]="link">
      <div class="stat-icon">{{ icon }}</div>
      <div class="stat-body">
        <span class="stat-value">{{ value }}</span>
        <span class="stat-label">{{ label }}</span>
      </div>
    </div>
  `,
    styles: [`
    .stat-card {
      padding: 1.25rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      cursor: pointer;
      transition: transform var(--transition), box-shadow var(--transition);
    }
    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }
    .stat-icon { font-size: 2rem; }
    .stat-body { display: flex; flex-direction: column; }
    .stat-value { font-size: 1.5rem; font-weight: 700; color: var(--primary); }
    .stat-label { font-size: 0.8rem; color: var(--text-secondary); }
  `]
})
export class StatCardComponent {
    value = 0;
    label = '';
    icon = '📊';
    link = '/';
}
