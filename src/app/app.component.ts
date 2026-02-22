import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent],
  template: `
    <!-- Indicateur de débogage pour voir si le shell charge -->
    <div style="background: #3B82F6; color: white; padding: 5px; text-align: center; font-size: 12px; position: fixed; top: 0; width: 100%; z-index: 9999;">
      DEBUG: App Shell Loaded
    </div>

    <div class="app-wrapper" style="padding-top: 30px;">
      <app-navbar></app-navbar>
      
      <main class="main-content">
        <!-- TEST: Message simple au cas où le router-outlet échoue -->
        <div *ngIf="false" style="padding: 100px; text-align: center;">
             <h2>Contenu statique (Router désactivé)</h2>
        </div>
        
        <router-outlet></router-outlet>
      </main>

      <app-footer></app-footer>
    </div>
  `,
  styles: [`
    .app-wrapper {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .main-content {
      flex: 1;
      margin-top: 64px;
    }
  `]
})
export class AppComponent { }
