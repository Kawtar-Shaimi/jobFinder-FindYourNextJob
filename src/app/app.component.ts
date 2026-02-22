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
    <!-- BANDEAU DE DEBUG CRITIQUE -->
    <div style="background: #e11d48; color: white; padding: 10px; text-align: center; font-weight: bold; position: fixed; top: 0; width: 100%; z-index: 10000;">
      DEBUG : LE BOOTSTRAP FONCTIONNE
    </div>

    <div class="app-wrapper" style="padding-top: 40px;">
      <app-navbar></app-navbar>
      
      <main class="main-content">
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
export class AppComponent {
  constructor() {
    console.log('AppComponent Initialized');
  }
}
