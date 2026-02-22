import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { FavoriteOffer } from '../../core/models/favorite.model';
import { selectFavorites, selectFavoritesLoading } from '../../store/favorites/favorites.selectors';
import { removeFavorite, loadFavorites } from '../../store/favorites/favorites.actions';
import { AuthService } from '../../core/services/auth.service';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import { TimeAgoPipe } from '../../shared/pipes/time-ago.pipe';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterLink, SpinnerComponent, TimeAgoPipe],
  template: `
    <div class="page-container">
      <div class="container">
        <div class="page-header">
          <div style="display:flex; align-items:center; gap:0.75rem;">
            <h1>❤️ Mes Favoris</h1>
            <span class="badge badge-primary" *ngIf="(favorites$ | async)?.length! > 0">{{ (favorites$ | async)?.length }}</span>
          </div>
          <p class="text-muted">Les offres d'emploi que vous avez sauvegardées</p>
        </div>

        <app-spinner *ngIf="loading$ | async"></app-spinner>

        <!-- Empty state -->
        <div *ngIf="!(loading$ | async) && (favorites$ | async)?.length === 0" class="empty-state">
          <div class="empty-state-icon">🤍</div>
          <h3>Vous n'avez pas encore de favoris</h3>
          <p>Explorez les offres d'emploi et cliquez sur le cœur pour sauvegarder celles qui vous intéressent.</p>
          <a routerLink="/home" class="btn btn-primary">Rechercher des offres</a>
        </div>

        <!-- Favorites Grid -->
        <div class="favorites-grid" *ngIf="(favorites$ | async)?.length! > 0">
          <div
            class="fav-card card"
            *ngFor="let fav of favorites$ | async"
          >
            <div class="fav-card-header">
              <div>
                <h3 class="fav-title">{{ fav.title }}</h3>
                <p class="fav-company">{{ fav.company }}</p>
              </div>
              <button
                class="btn-icon active"
                (click)="removeFavorite(fav)"
                title="Retirer des favoris"
              >
                ❤️
              </button>
            </div>

            <div class="fav-meta">
              <span class="meta-item">📍 {{ fav.location }}</span>
              <span class="meta-item" *ngIf="fav.salary">💰 {{ fav.salary }}</span>
              <span class="meta-item">🕐 {{ fav.publishedAt | timeAgo }}</span>
            </div>

            <div class="fav-footer">
              <a [href]="fav.url" target="_blank" class="btn btn-primary btn-sm">
                Voir l'offre ↗
              </a>
              <span class="badge badge-primary">{{ fav.apiSource }}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 2rem 0 3rem; }
    .page-header { margin-bottom: 2rem; }
    .page-header h1 { font-size: 1.8rem; }

    .favorites-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.25rem;
    }

    .fav-card {
      padding: 1.25rem 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .fav-card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 0.75rem;
    }

    .fav-title {
      font-size: 0.95rem;
      font-weight: 600;
      line-height: 1.4;
      margin-bottom: 0.2rem;
    }

    .fav-company {
      font-size: 0.85rem;
      color: var(--primary);
      font-weight: 500;
    }

    .fav-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 0.6rem;
    }

    .meta-item {
      font-size: 0.8rem;
      color: var(--text-secondary);
    }

    .fav-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    @media (max-width: 480px) {
      .favorites-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class FavoritesComponent implements OnInit {
  favorites$!: Observable<FavoriteOffer[]>;
  loading$!: Observable<boolean>;

  constructor(
    private store: Store,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/auth/login']);
      return;
    }
    this.store.dispatch(loadFavorites({ userId: user.id }));
    this.favorites$ = this.store.select(selectFavorites);
    this.loading$ = this.store.select(selectFavoritesLoading);
  }

  removeFavorite(fav: FavoriteOffer): void {
    this.store.dispatch(removeFavorite({ id: fav.id!, offerId: fav.offerId }));
  }
}
