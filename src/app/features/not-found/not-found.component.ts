import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-not-found',
    standalone: true,
    imports: [RouterLink],
    template: `
    <div class="not-found-page">
      <div class="not-found-content">
        <div class="not-found-icon">🔍</div>
        <h1>404</h1>
        <h2>Page introuvable</h2>
        <p class="text-muted">La page que vous recherchez n'existe pas ou a été déplacée.</p>
        <a routerLink="/home" class="btn btn-primary btn-lg">
          Retour à l'accueil
        </a>
      </div>
    </div>
  `,
    styles: [`
    .not-found-page {
      min-height: calc(100vh - 64px);
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 2rem;
    }
    .not-found-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }
    .not-found-icon { font-size: 4rem; }
    h1 {
      font-size: 5rem;
      font-weight: 800;
      color: var(--primary);
      line-height: 1;
    }
    h2 {
      font-size: 1.5rem;
      color: var(--text-primary);
    }
    p { max-width: 360px; }
  `]
})
export class NotFoundComponent { }
