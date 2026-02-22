import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { JobService } from '../../core/services/job.service';
import { AuthService } from '../../core/services/auth.service';
import { ApplicationService } from '../../core/services/application.service';
import { Job } from '../../core/models/job.model';
import { JobCardComponent } from '../../shared/components/job-card/job-card.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import { SearchFiltersComponent } from '../../shared/components/search-filters/search-filters.component';
import { JobStatsComponent } from '../../shared/components/job-stats/job-stats.component';
import { loadFavorites } from '../../store/favorites/favorites.actions';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    JobCardComponent,
    PaginationComponent,
    SpinnerComponent,
    SearchFiltersComponent,
    JobStatsComponent
  ],
  template: `
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">Trouvez votre prochaine<br>opportunité avec confiance</h1>
          <p class="hero-subtitle">Des milliers d'offres d'emploi, mises à jour en temps réel depuis les meilleures sources.</p>
        </div>

        <form [formGroup]="searchForm" (ngSubmit)="onSearch()" class="search-box">
          <app-search-filters [searchForm]="searchForm"></app-search-filters>
          <button type="submit" class="btn btn-primary btn-lg search-btn" [disabled]="loading">
            🔍 Rechercher
          </button>
        </form>
      </div>
    </section>

    <!-- Results Section -->
    <section class="results-section">
      <div class="container">
        <app-job-stats
          *ngIf="hasSearched && !loading && totalCount > 0"
          [total]="totalCount"
          [currentPage]="currentPage"
          [totalPages]="totalPages"
        ></app-job-stats>

        <app-spinner *ngIf="loading"></app-spinner>

        <div *ngIf="errorMessage && !loading" class="alert alert-error">
          ⚠️ {{ errorMessage }}
        </div>

        <div *ngIf="!hasSearched && !loading" class="empty-state">
          <div class="empty-state-icon">🌟</div>
          <h3>Commencez votre recherche</h3>
          <p>Entrez un titre de poste et/ou une localisation pour trouver des offres d'emploi.</p>
        </div>

        <div *ngIf="hasSearched && !loading && jobs.length === 0 && !errorMessage" class="empty-state">
          <div class="empty-state-icon">🔍</div>
          <h3>Aucune offre trouvée</h3>
          <p>Essayez des mots-clés différents ou élargissez votre recherche.</p>
        </div>

        <div class="jobs-list" *ngIf="jobs.length > 0 && !loading">
          <app-job-card
            *ngFor="let job of jobs"
            [job]="job"
            [isTracked]="trackedOfferIds.has(job.id)"
          ></app-job-card>
        </div>

        <app-pagination
          *ngIf="totalPages > 1 && !loading"
          [currentPage]="currentPage"
          [totalPages]="totalPages"
          (pageChange)="onPageChange($event)"
        ></app-pagination>
      </div>
    </section>
  `,
  styles: [`
    .hero { background: linear-gradient(135deg, #EFF6FF 0%, #F0FDF4 100%); padding: 3.5rem 0 2.5rem; border-bottom: 1px solid var(--border); }
    .hero-content { text-align: center; margin-bottom: 2rem; }
    .hero-title { font-size: 2.2rem; font-weight: 700; margin-bottom: 0.75rem; line-height: 1.25; }
    .hero-subtitle { color: var(--text-secondary); font-size: 1rem; max-width: 520px; margin: 0 auto; }
    .search-box { background: var(--card); border-radius: var(--radius-lg); box-shadow: var(--shadow-md); padding: 1rem 1.25rem; display: flex; gap: 0.75rem; align-items: stretch; max-width: 800px; margin: 0 auto; }
    .search-btn { white-space: nowrap; flex-shrink: 0; }
    .results-section { padding: 2rem 0 3rem; }
    .jobs-list { display: flex; flex-direction: column; gap: 1rem; }
    @media (max-width: 768px) { .hero-title { font-size: 1.5rem; } .search-box { flex-direction: column; } }
  `]
})
export class HomeComponent implements OnInit, OnDestroy {
  searchForm: FormGroup;
  jobs: Job[] = [];
  loading = false;
  errorMessage = '';
  hasSearched = false;
  currentPage = 1;
  totalPages = 1;
  totalCount = 0;
  pageSize = 10;
  trackedOfferIds = new Set<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private jobService: JobService,
    private authService: AuthService,
    private applicationService: ApplicationService,
    private store: Store
  ) {
    this.searchForm = this.fb.group({
      keyword: [''],
      location: ['']
    });
  }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.store.dispatch(loadFavorites({ userId: user.id }));
      this.loadTrackedApplications(user.id);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadTrackedApplications(userId: number): void {
    this.applicationService.getApplicationsByUser(userId).subscribe({
      next: (apps) => {
        this.trackedOfferIds = new Set(apps.map(a => a.offerId));
      }
    });
  }

  onSearch(): void {
    const { keyword, location } = this.searchForm.value;
    if (!keyword && !location) return;
    this.currentPage = 1;
    this.doSearch(keyword, location, 1);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    const { keyword, location } = this.searchForm.value;
    this.doSearch(keyword, location, page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private doSearch(keyword: string, location: string, page: number): void {
    this.loading = true;
    this.errorMessage = '';
    this.jobs = [];
    this.hasSearched = true;

    this.jobService.searchJobs(keyword, location, page).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: ({ jobs, total }) => {
        this.jobs = jobs;
        this.totalCount = total;
        this.totalPages = Math.max(1, Math.ceil(total / this.pageSize));
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.message || 'Erreur lors de la recherche.';
        this.loading = false;
      }
    });
  }
}
