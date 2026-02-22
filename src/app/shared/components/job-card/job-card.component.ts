import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Job } from '../../../core/models/job.model';
import { AuthService } from '../../../core/services/auth.service';
import { ApplicationService } from '../../../core/services/application.service';
import { FavoriteOffer } from '../../../core/models/favorite.model';
import { Application } from '../../../core/models/application.model';
import { TimeAgoPipe } from '../../pipes/time-ago.pipe';

@Component({
  selector: 'app-job-card',
  standalone: true,
  imports: [CommonModule, TimeAgoPipe],
  template: `
    <div class="job-card card">
      <div class="job-card-header">
        <div class="job-info">
          <h3 class="job-title">{{ job.title }}</h3>
          <p class="job-company">🏢 {{ job.company }}</p>
        </div>
        <button
          *ngIf="isLoggedIn"
          class="btn-icon fav-btn"
          (click)="toggleFavorite()"
        >
          🤍
        </button>
      </div>

      <div class="job-meta">
        <span class="meta-item">📍 {{ job.location }}</span>
        <span class="meta-item">🕐 {{ job.publishedAt | timeAgo }}</span>
        <span *ngIf="job.salary" class="badge badge-secondary salary-badge">
          💰 {{ job.salary }}
        </span>
      </div>

      <p class="job-description">
        {{ job.description | slice:0:180 }}{{ job.description.length > 180 ? '...' : '' }}
      </p>

      <div class="job-card-footer">
        <a [href]="job.url" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
          Voir l'offre ↗
        </a>
        <button
          *ngIf="isLoggedIn"
          class="btn btn-ghost btn-sm"
          (click)="trackApplication()"
          [disabled]="isTracked"
        >
          {{ isTracked ? '✅ Suivi' : '📋 Candidature' }}
        </button>
      </div>

      <div *ngIf="feedbackMessage" class="feedback-toast">
        {{ feedbackMessage }}
      </div>
    </div>
  `,
  styles: [`
    .job-card { padding: 1.25rem 1.5rem; display: flex; flex-direction: column; gap: 0.75rem; position: relative; }
    .job-card-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 0.75rem; }
    .job-info { flex: 1; min-width: 0; }
    .job-title { font-size: 1rem; font-weight: 600; color: var(--text-primary); line-height: 1.4; margin-bottom: 0.25rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .job-company { font-size: 0.85rem; color: var(--primary); font-weight: 500; }
    .fav-btn { flex-shrink: 0; width: 36px; height: 36px; font-size: 1.1rem; }
    .job-meta { display: flex; align-items: center; flex-wrap: wrap; gap: 0.6rem; }
    .meta-item { font-size: 0.8rem; color: var(--text-secondary); }
    .salary-badge { font-size: 0.78rem; }
    .job-description { font-size: 0.875rem; color: var(--text-secondary); line-height: 1.6; }
    .job-card-footer { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }
    .feedback-toast { position: absolute; bottom: -10px; left: 1.5rem; background: var(--text-primary); color: white; font-size: 0.78rem; padding: 0.3rem 0.75rem; border-radius: 20px; animation: fadeInUp 0.2s ease; }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
    @media (max-width: 480px) { .job-title { white-space: normal; } }
  `]
})
export class JobCardComponent implements OnInit {
  @Input() job!: Job;
  @Input() isTracked = false;

  isLoggedIn = false;
  feedbackMessage = '';

  constructor(
    private authService: AuthService,
    private applicationService: ApplicationService
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  toggleFavorite(): void {
    this.showFeedback('Mode dégradé : Favoris désactivés un instant');
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
        this.showFeedback('Candidature ajoutée ✅');
      },
      error: () => this.showFeedback('Erreur lors de l\'ajout')
    });
  }

  private showFeedback(message: string): void {
    this.feedbackMessage = message;
    setTimeout(() => this.feedbackMessage = '', 2500);
  }
}
