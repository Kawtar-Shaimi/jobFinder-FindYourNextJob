import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
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

@Component({
    selector: 'app-job-card',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="job-card card">
      <div class="job-card-header">
        <div class="job-info">
          <h3 class="job-title">{{ job.title }}</h3>
          <p class="job-company">{{ job.company }}</p>
        </div>
        <div class="job-actions" *ngIf="isLoggedIn">
          <button
            class="btn-icon"
            [class.active]="isFavorite$ | async"
            (click)="toggleFavorite()"
            title="{{ (isFavorite$ | async) ? 'Retirer des favoris' : 'Ajouter aux favoris' }}"
          >
            {{ (isFavorite$ | async) ? '❤️' : '🤍' }}
          </button>
        </div>
      </div>

      <div class="job-meta">
        <span class="meta-item">
          📍 {{ job.location }}
        </span>
        <span class="meta-item">
          📅 {{ job.publishedAt | date: 'dd/MM/yyyy' }}
        </span>
        <span *ngIf="job.salary" class="badge badge-secondary salary-badge">
          💰 {{ job.salary }}
        </span>
      </div>

      <p class="job-description">{{ job.description | slice:0:160 }}...</p>

      <div class="job-card-footer">
        <a [href]="job.url" target="_blank" class="btn btn-primary btn-sm">
          Voir l'offre ↗
        </a>
        <button
          *ngIf="isLoggedIn"
          class="btn btn-outline btn-sm"
          (click)="trackApplication()"
          [disabled]="isTracked"
        >
          {{ isTracked ? '✅ Suivi' : '📋 Suivre candidature' }}
        </button>
      </div>

      <div *ngIf="feedbackMessage" class="alert alert-success mt-1" style="padding: 0.5rem 0.75rem; font-size: 0.8rem;">
        {{ feedbackMessage }}
      </div>
    </div>
  `,
    styles: [`
    .job-card {
      padding: 1.25rem 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .job-card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 0.75rem;
    }

    .job-info { flex: 1; }

    .job-title {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary);
      line-height: 1.4;
      margin-bottom: 0.2rem;
    }

    .job-company {
      font-size: 0.875rem;
      color: var(--primary);
      font-weight: 500;
    }

    .job-meta {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.75rem;
    }

    .meta-item {
      font-size: 0.8rem;
      color: var(--text-secondary);
    }

    .salary-badge {
      font-size: 0.78rem;
    }

    .job-description {
      font-size: 0.875rem;
      color: var(--text-secondary);
      line-height: 1.6;
    }

    .job-card-footer {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }
  `]
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
                this.showFeedback('Ajouté aux favoris ❤️');
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
                this.showFeedback('Candidature ajoutée au suivi ✅');
            },
            error: () => this.showFeedback('Erreur lors de l\'ajout')
        });
    }

    private showFeedback(message: string): void {
        this.feedbackMessage = message;
        setTimeout(() => this.feedbackMessage = '', 2500);
    }
}
