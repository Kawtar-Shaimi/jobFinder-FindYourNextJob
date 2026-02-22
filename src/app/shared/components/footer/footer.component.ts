import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="bg-white border-t border-slate-100 py-12 mt-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row justify-between items-center gap-8">
          
          <!-- Brand -->
          <div class="flex flex-col items-center md:items-start">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center">
                 <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                   <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                   <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                 </svg>
              </div>
              <span class="text-base font-bold text-slate-900 tracking-tight">Job<span class="text-indigo-600">Finder</span></span>
            </div>
            <p class="text-xs text-slate-500">Votre carrière mérite le meilleur accompagnement.</p>
          </div>

          <!-- Links -->
          <div class="flex flex-wrap justify-center gap-6">
            <a routerLink="/home" class="text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Recherche</a>
            <a routerLink="/favorites" class="text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Favoris</a>
            <a routerLink="/applications" class="text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Candidatures</a>
            <a routerLink="/profile" class="text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Profil</a>
          </div>

          <!-- Copyright -->
          <div class="text-xs text-slate-400">
            © {{ year }} JobFinder. Tous droits réservés.
          </div>

        </div>
      </div>
    </footer>
  `,
  styles: []
})
export class FooterComponent {
  year = new Date().getFullYear();
}
