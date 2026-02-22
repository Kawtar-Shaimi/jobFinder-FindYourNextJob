import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-filters',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <div class="filters-wrapper" [formGroup]="searchForm">
      <div class="search-field">
        <span class="field-icon">🔍</span>
        <input
          type="text"
          formControlName="keyword"
          placeholder="Titre du poste, compétences..."
          class="search-input"
          id="keyword-input"
        />
      </div>
      <div class="search-field">
        <span class="field-icon">📍</span>
        <input
          type="text"
          formControlName="location"
          placeholder="Ville, pays, région..."
          class="search-input"
          id="location-input"
        />
      </div>
    </div>
  `,
  styles: [`
    .filters-wrapper {
      display: contents;
    }
    .search-field {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      border: 1.5px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 0 0.75rem;
      background: var(--card);
      transition: border-color var(--transition);
    }
    .search-field:focus-within { border-color: var(--primary); }
    .field-icon { font-size: 1rem; flex-shrink: 0; }
    .search-input {
      flex: 1;
      border: none;
      outline: none;
      font-family: inherit;
      font-size: 0.9rem;
      color: var(--text-primary);
      padding: 0.65rem 0;
      background: transparent;
      min-width: 0;
    }
    .search-input::placeholder { color: #B0BBD1; }
  `]
})
export class SearchFiltersComponent {
  @Input() searchForm!: FormGroup;
  @Output() search = new EventEmitter<void>();
}
