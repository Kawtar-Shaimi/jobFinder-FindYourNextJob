import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        loadComponent: () =>
            import('./features/home/home.component').then(m => m.HomeComponent)
    },
    {
        path: 'auth',
        children: [
            {
                path: 'login',
                loadComponent: () =>
                    import('./features/auth/login/login.component').then(m => m.LoginComponent)
            },
            {
                path: 'register',
                loadComponent: () =>
                    import('./features/auth/register/register.component').then(m => m.RegisterComponent)
            }
        ]
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
