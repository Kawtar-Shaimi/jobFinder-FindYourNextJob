import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-home-hero',
    standalone: true,
    imports: [RouterLink],
    template: `
    <div class="hero-cta" *ngIf="!isLoggedIn">
      <a routerLink="/auth/register" class="btn btn-primary btn-lg">Créer un compte gratuit</a>
      <a routerLink="/auth/login" class="btn btn-ghost">Se connecter</a>
    </div>
  `,
    styles: [`
    .hero-cta {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin-top: 1rem;
      flex-wrap: wrap;
    }
  `]
})
export class HomeHeroCtaComponent {
    isLoggedIn: boolean;
    constructor(private authService: AuthService) {
        this.isLoggedIn = this.authService.isLoggedIn();
    }
}
