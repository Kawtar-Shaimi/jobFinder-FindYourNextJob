import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: HomeComponent // Direct import for stability
    },
    {
        path: 'auth',
        loadChildren: () =>
            import('./features/auth/auth.routes').then(m => m.authRoutes)
    },
    {
        path: 'favorites',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./features/favorites/favorites.component').then(m => m.FavoritesComponent)
    },
    {
        path: 'applications',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./features/applications/applications.component').then(m => m.ApplicationsComponent)
    },
    {
        path: 'profile',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./features/profile/profile.component').then(m => m.ProfileComponent)
    },
    {
        path: 'not-found',
        loadComponent: () =>
            import('./features/not-found/not-found.component').then(m => m.NotFoundComponent)
    },
    {
        path: '**',
        redirectTo: 'not-found'
    }
];
