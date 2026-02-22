import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Job } from '../../../core/models/job.model';
import { AuthService } from '../../../core/services/auth.service';
import { ApplicationService } from '../../../core/services/application.service';
import { selectIsFavorite, selectFavoriteByOfferId } from '../../../store/favorites/favorites.selectors';
import * as FavoritesActions from '../../../store/favorites/favorites.actions';
import { FavoriteOffer } from '../../../core/models/favorite.model';
import { Application } from '../../../core/models/application.model';
import { TimeAgoPipe } from '../../pipes/time-ago.pipe';

@Component({
  selector: 'app-job-card',
  standalone: true,
  imports: [CommonModule, TimeAgoPipe],
  template: `
    <div class="bg-white border border-slate-200 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-100/40 hover:-translate-y-1 group relative">
      
      <!-- Card Header -->
      <div class="flex justify-between items-start mb-4">
        <div class="flex-1 min-w-0 pr-8">
          <h3 class="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate mb-1">
            {{ job.title }}
          </h3>
          <div class="flex items-center gap-2 text-indigo-600 font-semibold text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
            {{ job.company }}
          </div>
        </div>
        
        <!-- Favorite Button -->
        <button
          *ngIf="isLoggedIn"
          (click)="toggleFavorite()"
          class="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 group/fav"
          [class.bg-red-50]="isFavorite$ | async"
          [class.bg-slate-50]="!(isFavorite$ | async)"
          [class.text-red-500]="isFavorite$ | async"
          [class.text-slate-300]="!(isFavorite$ | async)"
          [title]="(isFavorite$ | async) ? 'Retirer des favoris' : 'Ajouter aux favoris'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 transition-transform group-hover/fav:scale-110" 
            [attr.fill]="(isFavorite$ | async) ? 'currentColor' : 'none'" 
            viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      </div>

      <!-- Meta info -->
      <div class="flex flex-wrap items-center gap-y-2 gap-x-4 mb-5">
        <div class="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          {{ job.location }}
        </div>
        <div class="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          {{ job.publishedAt | timeAgo }}
        </div>
        <div *ngIf="job.salary" class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
          {{ job.salary }}
        </div>
      </div>

      <!-- Description -->
      <p class="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-2">
        {{ job.description }}
      </p>

      <!-- Footer Actions -->
      <div class="flex items-center justify-between pt-4 border-t border-slate-50">
        <a [href]="job.url" target="_blank" rel="noopener noreferrer" 
          class="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors group/link">
          Consulter l'offre
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 transition-transform group-hover/link:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <line x1="7" y1="17" x2="17" y2="7"></line>
            <polyline points="7 7 17 7 17 17"></polyline>
          </svg>
        </a>
        
        <button
          *ngIf="isLoggedIn"
          (click)="trackApplication()"
          [disabled]="isTracked"
          class="px-5 py-2 rounded-xl text-xs font-bold transition-all"
          [class.bg-indigo-600]="!isTracked"
          [class.text-white]="!isTracked"
          [class.hover:bg-indigo-700]="!isTracked"
          [class.shadow-lg]="!isTracked"
          [class.shadow-indigo-100]="!isTracked"
          [class.bg-slate-100]="isTracked"
          [class.text-slate-500]="isTracked"
        >
          {{ isTracked ? 'Candidature suivie' : 'Suivre ma candidature' }}
        </button>
      </div>

      <!-- Feedback Toast -->
      <div *ngIf="feedbackMessage" 
        class="absolute -bottom-4 left-6 bg-slate-900 px-4 py-2 rounded-lg shadow-xl animate-in slide-in-from-bottom-2 fade-in duration-300">
        <p class="text-white text-[10px] font-bold">{{ feedbackMessage }}</p>
      </div>
    </div>
  `,
  styles: []
})
export class JobCardComponent implements OnInit {
  @Input() job!: Job;
  @Input() isTracked = false;

  isFavorite$!: Observable<boolean>;
  isLoggedIn = false;
  feedbackMessage = '';

  constructor(
    private store: Store,
    private authService: AuthService,
    private applicationService: ApplicationService
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.isFavorite$ = this.store.select(selectIsFavorite(this.job.id));
  }

  toggleFavorite(): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    this.store.select(selectFavoriteByOfferId(this.job.id)).subscribe(existing => {
      if (existing) {
        this.store.dispatch(FavoritesActions.removeFavorite({ id: existing.id!, offerId: this.job.id }));
        this.showFeedback('Retiré des favoris');
      } else {
        const favorite: FavoriteOffer = {
          userId: user.id,
          offerId: this.job.id,
          title: this.job.title,
          company: this.job.company,
          location: this.job.location,
          url: this.job.url,
          salary: this.job.salary,
          publishedAt: this.job.publishedAt,
          apiSource: this.job.apiSource
        };
        this.store.dispatch(FavoritesActions.addFavorite({ favorite }));
        this.showFeedback('Ajouté aux favoris');
      }
    }).unsubscribe();
  }

  trackApplication(): void {
    const user = this.authService.getCurrentUser();
    if (!user || this.isTracked) return;

    const application: Application = {
      userId: user.id,
      offerId: this.job.id,
      apiSource: this.job.apiSource,
      title: this.job.title,
      company: this.job.company,
      location: this.job.location,
      url: this.job.url,
      status: 'en_attente',
      notes: '',
      dateAdded: new Date().toISOString()
    };

    this.applicationService.addApplication(application).subscribe({
      next: () => {
        this.isTracked = true;
        this.showFeedback('Candidature suivie');
      },
      error: () => this.showFeedback('Une erreur est survenue')
    });
  }

  private showFeedback(message: string): void {
    this.feedbackMessage = message;
    setTimeout(() => this.feedbackMessage = '', 2500);
  }
}
