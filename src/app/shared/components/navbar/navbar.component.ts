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
    <nav class="navbar">
      <div class="nav-container">
        <!-- Logo -->
        <a routerLink="/home" class="nav-logo">
          <span class="logo-icon">💼</span>
          <span class="logo-text">JobFinder</span>
        </a>

        <!-- Mobile hamburger -->
        <button class="hamburger" (click)="toggleMenu()" aria-label="Menu">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <!-- Nav links -->
        <div class="nav-links" [class.open]="menuOpen">
          <a routerLink="/home" routerLinkActive="active" class="nav-link" (click)="closeMenu()">
            🔍 Rechercher
          </a>

          <ng-container *ngIf="currentUser; else guestLinks">
            <a routerLink="/favorites" routerLinkActive="active" class="nav-link" (click)="closeMenu()">
              ❤️ Favoris
            </a>
            <a routerLink="/applications" routerLinkActive="active" class="nav-link" (click)="closeMenu()">
              📋 Candidatures
            </a>
            <div class="nav-user">
              <span class="user-name">{{ currentUser.firstName }}</span>
              <div class="user-dropdown">
                <a routerLink="/profile" class="dropdown-item" (click)="closeMenu()">👤 Mon profil</a>
                <button class="dropdown-item text-danger-item" (click)="logout()">🚪 Se déconnecter</button>
              </div>
            </div>
          </ng-container>

          <ng-template #guestLinks>
            <a routerLink="/auth/login" routerLinkActive="active" class="nav-link" (click)="closeMenu()">
              Connexion
            </a>
            <a routerLink="/auth/register" class="btn btn-primary btn-sm" (click)="closeMenu()">
              S'inscrire
            </a>
          </ng-template>
        </div>
      </div>
    </nav>
  `,
    styles: [`
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 64px;
      background: rgba(255,255,255,0.95);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid var(--border);
      z-index: 1000;
      box-shadow: var(--shadow-sm);
    }

    .nav-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 100%;
      max-width: 1100px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    .nav-logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      font-weight: 700;
      font-size: 1.1rem;
      color: var(--text-primary);
    }
    .logo-icon { font-size: 1.3rem; }
    .logo-text { color: var(--primary); }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .nav-link {
      padding: 0.45rem 0.8rem;
      border-radius: var(--radius-sm);
      color: var(--text-secondary);
      font-size: 0.9rem;
      font-weight: 500;
      text-decoration: none;
      transition: all var(--transition);
    }
    .nav-link:hover, .nav-link.active {
      color: var(--primary);
      background: rgba(91, 141, 239, 0.08);
    }

    .nav-user {
      position: relative;
      display: flex;
      align-items: center;
    }
    .user-name {
      padding: 0.45rem 0.9rem;
      border-radius: var(--radius-sm);
      background: rgba(91, 141, 239, 0.1);
      color: var(--primary);
      font-weight: 600;
      font-size: 0.875rem;
      cursor: pointer;
    }
    .user-dropdown {
      display: none;
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      background: var(--card);
      border-radius: var(--radius);
      box-shadow: var(--shadow-lg);
      border: 1px solid var(--border);
      padding: 0.5rem;
      min-width: 160px;
      z-index: 100;
    }
    .nav-user:hover .user-dropdown { display: flex; flex-direction: column; }
    .dropdown-item {
      padding: 0.5rem 0.8rem;
      border-radius: var(--radius-sm);
      font-size: 0.875rem;
      color: var(--text-primary);
      text-decoration: none;
      background: none;
      border: none;
      cursor: pointer;
      font-family: inherit;
      text-align: left;
      transition: background var(--transition);
      display: block;
      width: 100%;
    }
    .dropdown-item:hover { background: var(--bg); }
    .text-danger-item { color: var(--danger) !important; }

    .hamburger {
      display: none;
      flex-direction: column;
      gap: 4px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
    }
    .hamburger span {
      display: block;
      width: 22px;
      height: 2px;
      background: var(--text-primary);
      border-radius: 2px;
      transition: all var(--transition);
    }

    @media (max-width: 768px) {
      .hamburger { display: flex; }
      .nav-links {
        display: none;
        position: fixed;
        top: 64px;
        left: 0;
        right: 0;
        background: var(--card);
        flex-direction: column;
        align-items: flex-start;
        padding: 1rem 1.5rem;
        border-bottom: 1px solid var(--border);
        box-shadow: var(--shadow-md);
        gap: 0.25rem;
      }
      .nav-links.open { display: flex; }
      .nav-link { width: 100%; padding: 0.6rem 0.8rem; }
      .nav-user { width: 100%; }
      .user-name { width: 100%; }
      .user-dropdown {
        display: flex !important;
        flex-direction: column;
        position: static;
        box-shadow: none;
        border: none;
        padding: 0.25rem 0.5rem;
        background: var(--bg);
        width: 100%;
        border-radius: var(--radius-sm);
        margin-top: 0.25rem;
      }
    }
  `]
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
