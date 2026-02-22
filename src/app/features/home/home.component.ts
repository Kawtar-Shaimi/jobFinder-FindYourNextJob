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
    <section class="relative pt-32 pb-20 overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white to-indigo-50/30 -z-10"></div>
      <div class="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-indigo-100/30 rounded-full blur-3xl -z-10"></div>
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto mb-12">
          <h1 class="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6">
            Trouvez votre prochaine <span class="text-indigo-600">opportunité</span>
          </h1>
          <p class="text-lg text-slate-600 leading-relaxed mb-10">
            Parcourez des milliers d'offres d'emploi mises à jour en temps réel et propulsez votre carrière vers de nouveaux sommets.
          </p>
        </div>

        <!-- Professional Search Box -->
        <div class="max-w-4xl mx-auto bg-white p-2 rounded-2xl shadow-2xl shadow-indigo-100/50 border border-slate-100">
          <form [formGroup]="searchForm" (ngSubmit)="onSearch()" class="flex flex-col md:flex-row gap-2">
            <app-search-filters [searchForm]="searchForm" class="flex-1"></app-search-filters>
            <button type="submit" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 group" [disabled]="loading">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              Trouver un job
            </button>
          </form>
        </div>
      </div>
    </section>

    <!-- Content Section -->
    <section class="pb-24">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Stats -->
        <app-job-stats
          *ngIf="hasSearched && !loading && totalCount > 0"
          [total]="totalCount"
          [currentPage]="currentPage"
          [totalPages]="totalPages"
          class="mb-6 block"
        ></app-job-stats>

        <!-- Loading -->
        <div class="py-20" *ngIf="loading">
          <app-spinner></app-spinner>
        </div>

        <!-- Error -->
        <div *ngIf="errorMessage && !loading" class="bg-red-50 border border-red-100 text-red-700 px-6 py-4 rounded-xl flex items-center gap-3 mb-8 animate-in fade-in duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span class="font-medium">{{ errorMessage }}</span>
        </div>


        <!-- No results -->
        <div *ngIf="hasSearched && !loading && jobs.length === 0 && !errorMessage" class="text-center py-20">
          <div class="text-6xl mb-6">🔍</div> <!-- Keeping one search icon for context, but making it modern -->
          <h3 class="text-2xl font-bold text-slate-800 mb-2">Aucun résultat</h3>
          <p class="text-slate-500">Désolé, nous n'avons trouvé aucune offre correspondant à vos critères.</p>
          <button (click)="searchForm.reset()" class="mt-6 text-indigo-600 font-semibold hover:text-indigo-700">Réinitialiser les filtres</button>
        </div>

        <!-- Job Cards List -->
        <div class="space-y-4" *ngIf="jobs.length > 0 && !loading">
          <app-job-card
            *ngFor="let job of jobs"
            [job]="job"
            [isTracked]="trackedOfferIds.has(job.id)"
          ></app-job-card>
        </div>

        <!-- Pagination -->
        <div class="mt-12 flex justify-center" *ngIf="totalPages > 1 && !loading">
          <app-pagination
            [currentPage]="currentPage"
            [totalPages]="totalPages"
            (pageChange)="onPageChange($event)"
          ></app-pagination>
        </div>
      </div>
    </section>
  `,
  styles: []
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
    // Load initial jobs (trending/latest)
    this.doSearch('', '', 1);
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
    this.currentPage = 1;
    this.doSearch(keyword || '', location || '', 1);
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
