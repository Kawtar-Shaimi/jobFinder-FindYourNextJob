import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [RouterLink],
    template: `
    <footer class="footer">
      <div class="container footer-content">
        <div class="footer-brand">
          <span class="footer-logo">🧭 JobFinder</span>
          <p class="footer-tagline">Votre prochaine étape professionnelle, simplifiée.</p>
        </div>
        <div class="footer-links">
          <a routerLink="/home" class="footer-link">Recherche</a>
          <a routerLink="/favorites" class="footer-link">Favoris</a>
          <a routerLink="/applications" class="footer-link">Candidatures</a>
          <a routerLink="/profile" class="footer-link">Profil</a>
        </div>
        <p class="footer-copy">© {{ year }} JobFinder. Tous droits réservés.</p>
      </div>
    </footer>
  `,
    styles: [`
    .footer {
      background: var(--card);
      border-top: 1px solid var(--border);
      padding: 1.5rem 0;
      margin-top: auto;
    }
    .footer-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .footer-logo {
      font-weight: 700;
      font-size: 1rem;
      color: var(--primary);
    }
    .footer-tagline {
      font-size: 0.78rem;
      color: var(--text-secondary);
      margin-top: 0.2rem;
    }
    .footer-links {
      display: flex;
      gap: 1.25rem;
      flex-wrap: wrap;
    }
    .footer-link {
      font-size: 0.85rem;
      color: var(--text-secondary);
      text-decoration: none;
      transition: color var(--transition);
    }
    .footer-link:hover { color: var(--primary); }
    .footer-copy {
      font-size: 0.78rem;
      color: var(--text-muted, #B0BBD1);
    }
    @media (max-width: 600px) {
      .footer-content { flex-direction: column; text-align: center; }
      .footer-links { justify-content: center; }
    }
  `]
})
export class FooterComponent {
    year = new Date().getFullYear();
}
