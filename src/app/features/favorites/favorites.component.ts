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
    <div class="min-h-[calc(100vh-64px)] pt-24 pb-16 bg-slate-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Page Header -->
        <div class="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div class="max-w-2xl">
            <div class="flex items-center gap-3 mb-2">
              <div class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </div>
              <h1 class="text-3xl font-black text-slate-900 tracking-tight">Mes Favoris</h1>
              <span *ngIf="(favorites$ | async)?.length! > 0" class="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase">
                {{ (favorites$ | async)?.length }}
              </span>
            </div>
            <p class="text-slate-500 font-medium">Retrouvez toutes les opportunités que vous avez sauvegardées pour plus tard.</p>
          </div>
          
          <a routerLink="/home" class="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors group">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            Explorer d'autres offres
          </a>
        </div>

        <div *ngIf="loading$ | async" class="py-20">
          <app-spinner></app-spinner>
        </div>

        <!-- Empty state -->
        <div *ngIf="!(loading$ | async) && (favorites$ | async)?.length === 0" 
          class="text-center py-20 px-6 bg-white border border-dashed border-slate-200 rounded-3xl max-w-2xl mx-auto shadow-sm">
          <div class="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-slate-800 mb-2">Aucun favori pour le moment</h3>
          <p class="text-slate-500 max-w-sm mx-auto mb-10">Parcourez les offres d'emploi et enregistrez celles qui correspondent à vos ambitions.</p>
          <a routerLink="/home" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-indigo-100 transition-all">
            Découvrir des offres
          </a>
        </div>

        <!-- Favorites Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" *ngIf="(favorites$ | async)?.length! > 0">
          <div
            class="bg-white border border-slate-200 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-100/40 hover:-translate-y-1 group relative flex flex-col h-full"
            *ngFor="let fav of favorites$ | async"
          >
            <div class="flex justify-between items-start mb-4">
              <div class="flex-1 min-w-0 pr-8">
                <h3 class="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate mb-1">
                  {{ fav.title }}
                </h3>
                <div class="flex items-center gap-2 text-indigo-600 font-semibold text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                  {{ fav.company }}
                </div>
              </div>
              <button
                (click)="removeFavorite(fav)"
                class="absolute top-4 right-4 w-9 h-9 bg-red-50 text-red-500 rounded-full flex items-center justify-center transition-all hover:bg-red-100 group/btn"
                title="Retirer des favoris"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 fill-current transition-transform group-hover/btn:scale-110" viewBox="0 0 24 24">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>
            </div>

            <div class="flex flex-wrap items-center gap-y-2 gap-x-4 mb-auto pb-6">
              <div class="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                {{ fav.location }}
              </div>
              <div *ngIf="fav.salary" class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                {{ fav.salary }}
              </div>
              <div class="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-widest ml-auto">
                {{ fav.publishedAt | timeAgo }}
              </div>
            </div>

            <div class="pt-5 border-t border-slate-50 flex items-center justify-between">
              <a [href]="fav.url" target="_blank" class="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors group/link">
                Accéder à l'offre
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <line x1="7" y1="17" x2="17" y2="7"></line>
                  <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
              </a>
              <span class="bg-slate-100 text-slate-500 px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest">{{ fav.apiSource }}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: []
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
