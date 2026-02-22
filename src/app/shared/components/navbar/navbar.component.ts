import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { AuthUser } from '../../../core/models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <nav class="fixed top-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 z-[1000] shadow-sm transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        
        <!-- Logo -->
        <a routerLink="/home" class="flex items-center gap-2.5 transition-opacity hover:opacity-90">
          <div class="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            </svg>
          </div>
          <span class="text-xl font-bold tracking-tight text-slate-900">Job<span class="text-indigo-600">Finder</span></span>
        </a>

        <!-- Mobile hamburger -->
        <button class="md:hidden p-2 text-slate-600 hover:text-indigo-600 focus:outline-none" (click)="toggleMenu()" aria-label="Menu">
          <svg *ngIf="!menuOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
          <svg *ngIf="menuOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Nav links (Desktop) -->
        <div class="hidden md:flex items-center gap-1.5">
          <a routerLink="/home" routerLinkActive="bg-indigo-50 text-indigo-600" [routerLinkActiveOptions]="{exact: true}" class="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            Recherche
          </a>

          <ng-container *ngIf="currentUser; else guestLinks">
            <a routerLink="/favorites" routerLinkActive="bg-indigo-50 text-indigo-600" class="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              Favoris
            </a>
            <a routerLink="/applications" routerLinkActive="bg-indigo-50 text-indigo-600" class="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              Candidatures
            </a>
            
            <div class="relative group ml-1">
              <button class="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 transition-colors">
                <div class="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-xs uppercase">
                  {{ currentUser.firstName[0] }}{{ currentUser.lastName[0] }}
                </div>
                <span class="text-sm font-medium text-slate-700">{{ currentUser.firstName }}</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform group-hover:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
              
              <div class="absolute right-0 top-full pt-2 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200">
                <div class="bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden min-w-[180px]">
                  <a routerLink="/profile" class="flex items-center gap-2 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 border-b border-slate-50" (click)="closeMenu()">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    Mon profil
                  </a>
                  <button (click)="logout()" class="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 text-left font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                    Se déconnecter
                  </button>
                </div>
              </div>
            </div>
          </ng-container>

          <ng-template #guestLinks>
            <div class="flex items-center gap-3">
              <a routerLink="/auth/login" class="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors px-3 py-2">Connexion</a>
              <a routerLink="/auth/register" class="bg-indigo-600 text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all hover:-translate-y-0.5 active:translate-y-0">S'inscrire</a>
            </div>
          </ng-template>
        </div>
      </div>

      <!-- Mobile Menu (Conditional) -->
      <div *ngIf="menuOpen" class="md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-xl py-4 px-4 flex flex-col gap-2 animate-in slide-in-from-top duration-300">
        <a routerLink="/home" class="p-3 rounded-lg flex items-center gap-3 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium" (click)="closeMenu()">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          Recherche
        </a>
        <ng-container *ngIf="currentUser">
          <a routerLink="/favorites" class="p-3 rounded-lg flex items-center gap-3 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium" (click)="closeMenu()">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            Favoris
          </a>
          <a routerLink="/applications" class="p-3 rounded-lg flex items-center gap-3 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium" (click)="closeMenu()">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            Candidatures
          </a>
          <a routerLink="/profile" class="p-3 rounded-lg flex items-center gap-3 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium border-t border-slate-100" (click)="closeMenu()">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            Mon profil
          </a>
          <button (click)="logout()" class="w-full p-3 rounded-lg flex items-center gap-3 text-red-600 hover:bg-red-50 font-medium text-left">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            Se déconnecter
          </button>
        </ng-container>
        <ng-container *ngIf="!currentUser">
          <a routerLink="/auth/login" class="p-3 rounded-lg flex items-center gap-3 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium" (click)="closeMenu()">Connexion</a>
          <a routerLink="/auth/register" class="m-2 bg-indigo-600 text-white text-center font-bold p-3 rounded-lg" (click)="closeMenu()">S'inscrire</a>
        </ng-container>
      </div>
    </nav>
  `,
  styles: [] // Using only Tailwind and Global CSS
})
export class NavbarComponent implements OnInit {
  currentUser: AuthUser | null = null;
  menuOpen = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.router.events.subscribe(() => {
      this.currentUser = this.authService.getCurrentUser();
    });
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  logout(): void {
    this.authService.logout();
    this.currentUser = null;
    this.closeMenu();
    this.router.navigate(['/home']);
  }
}
