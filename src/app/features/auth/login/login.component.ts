import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  template: `
    <div class="min-h-[calc(100vh-64px)] flex items-center justify-center p-6 bg-slate-50">
      <div class="w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
        
        <!-- Header -->
        <div class="px-8 pt-10 pb-6 text-center">
          <div class="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
              <polyline points="10 17 15 12 10 7"></polyline>
              <line x1="15" y1="12" x2="3" y2="12"></line>
            </svg>
          </div>
          <h1 class="text-2xl font-black text-slate-900 mb-2">Bon retour !</h1>
          <p class="text-slate-500 text-sm">Prêt à trouver votre prochaine opportunité ?</p>
        </div>

        <div class="px-8 pb-10">
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-5">
            
            <!-- Global Error -->
            <div *ngIf="errorMessage" class="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl text-sm font-medium animate-in fade-in duration-300">
              {{ errorMessage }}
            </div>

            <!-- Email Field -->
            <div class="space-y-1.5">
              <label for="email" class="block text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Adresse email</label>
              <div class="relative group">
                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  class="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                  formControlName="email"
                  placeholder="votre@email.com"
                />
              </div>
              <p *ngIf="isFieldInvalid('email')" class="text-red-500 text-[11px] font-bold ml-1">
                {{ getFieldError('email') }}
              </p>
            </div>

            <!-- Password Field -->
            <div class="space-y-1.5">
              <label for="password" class="block text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Mot de passe</label>
              <div class="relative group">
                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
                <input
                  id="password"
                  [type]="showPassword ? 'text' : 'password'"
                  class="block w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                  formControlName="password"
                  placeholder="••••••••"
                />
                <button 
                  type="button" 
                  (click)="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-indigo-600 transition-colors focus:outline-none"
                >
                  <svg *ngIf="!showPassword" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg *ngIf="showPassword" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                </button>
              </div>
              <p *ngIf="isFieldInvalid('password')" class="text-red-500 text-[11px] font-bold ml-1">
                {{ getFieldError('password') }}
              </p>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:pointer-events-none"
              [disabled]="loading"
            >
              <div *ngIf="loading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>{{ loading ? 'Connexion en cours...' : 'Se connecter' }}</span>
              <svg *ngIf="!loading" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </form>

          <!-- Footer -->
          <div class="mt-8 text-center border-t border-slate-50 pt-6">
            <p class="text-sm text-slate-500">
              Nouveau sur la plateforme ? 
              <a routerLink="/auth/register" class="text-indigo-600 font-bold hover:text-indigo-700 transition-colors">Créer un compte</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = '';
  loading = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getFieldError(field: string): string {
    const control = this.loginForm.get(field);
    if (!control?.errors) return '';
    if (control.errors['required']) return 'Ce champ est obligatoire.';
    if (control.errors['email']) return 'Adresse email invalide.';
    if (control.errors['minlength']) return 'Minimum 6 caractères.';
    return '';
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.message || 'Email ou mot de passe incorrect.';
      }
    });
  }
}
