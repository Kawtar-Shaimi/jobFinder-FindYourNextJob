import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { httpErrorInterceptor } from './core/interceptors/http-error.interceptor';
import { FavoritesEffects } from './store/favorites/favorites.effects';
import { favoritesReducer } from './store/favorites/favorites.reducer';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([httpErrorInterceptor])),
    provideStore({ favorites: favoritesReducer }),
    provideEffects([FavoritesEffects])
    // DevTools disabled temporarily for stability
  ]
};
