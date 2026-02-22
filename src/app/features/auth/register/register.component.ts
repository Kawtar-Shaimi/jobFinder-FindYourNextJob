import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirm = control.get('confirmPassword');
  if (password && confirm && password.value !== confirm.value) {
    return { passwordMismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  template: `
    <div class="min-h-[calc(100vh-64px)] flex items-center justify-center p-6 bg-slate-50">
      <div class="w-full max-w-lg bg-white rounded-3xl shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
        
        <!-- Header -->
        <div class="px-8 pt-10 pb-6 text-center">
          <div class="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <line x1="20" y1="8" x2="20" y2="14"></line>
              <line x1="23" y1="11" x2="17" y2="11"></line>
            </svg>
          </div>
          <h1 class="text-2xl font-black text-slate-900 mb-2">Créer un compte</h1>
          <p class="text-slate-500 text-sm">Rejoignez la communauté JobFinder dès aujourd'hui.</p>
        </div>

        <div class="px-8 pb-10">
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-5">
            
            <!-- Alerts -->
            <div *ngIf="errorMessage" class="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl text-sm font-medium animate-in fade-in duration-300">
              {{ errorMessage }}
            </div>
            <div *ngIf="successMessage" class="bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-3 rounded-xl text-sm font-medium animate-in fade-in duration-300">
              {{ successMessage }}
            </div>

            <!-- Identity Row -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label for="firstName" class="block text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Prénom</label>
                <input
                  id="firstName"
                  type="text"
                  class="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                  formControlName="firstName"
                  placeholder="Jean"
                />
                <p *ngIf="isFieldInvalid('firstName')" class="text-red-500 text-[11px] font-bold ml-1">Prénom requis.</p>
              </div>
              <div class="space-y-1.5">
                <label for="lastName" class="block text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Nom</label>
                <input
                  id="lastName"
                  type="text"
                  class="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                  formControlName="lastName"
                  placeholder="Dupont"
                />
                <p *ngIf="isFieldInvalid('lastName')" class="text-red-500 text-[11px] font-bold ml-1">Nom requis.</p>
              </div>
            </div>

            <!-- Email Field -->
            <div class="space-y-1.5">
              <label for="email" class="block text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Adresse email</label>
              <input
                id="email"
                type="email"
                class="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                formControlName="email"
                placeholder="votre@email.com"
              />
              <p *ngIf="isFieldInvalid('email')" class="text-red-500 text-[11px] font-bold ml-1">
                {{ registerForm.get('email')?.errors?.['email'] ? 'Email invalide.' : 'Email obligatoire.' }}
              </p>
            </div>

            <!-- Password Field -->
            <div class="space-y-1.5">
              <label for="password" class="block text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Mot de passe</label>
              <div class="relative group">
                <input
                  id="password"
                  [type]="showPassword ? 'text' : 'password'"
                  class="block w-full px-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                  formControlName="password"
                  placeholder="Minimum 6 caractères"
                />
                <button 
                  type="button" 
                  (click)="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-indigo-600 transition-colors focus:outline-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path *ngIf="!showPassword" stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path *ngIf="!showPassword" stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    <path *ngIf="showPassword" stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                </button>
              </div>
              <p *ngIf="isFieldInvalid('password')" class="text-red-500 text-[11px] font-bold ml-1">Minimum 6 caractères.</p>
            </div>

            <!-- Confirm Password Field -->
            <div class="space-y-1.5">
              <label for="confirmPassword" class="block text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Confirmation</label>
              <input
                id="confirmPassword"
                type="password"
                class="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                formControlName="confirmPassword"
                placeholder="Répétez le mot de passe"
              />
              <p *ngIf="registerForm.errors?.['passwordMismatch'] && registerForm.get('confirmPassword')?.touched" class="text-red-500 text-[11px] font-bold ml-1">
                Les mots de passe ne correspondent pas.
              </p>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:pointer-events-none"
              [disabled]="loading"
            >
              <div *ngIf="loading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>{{ loading ? 'Création du compte...' : 'Créer mon compte' }}</span>
              <svg *ngIf="!loading" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </form>

          <!-- Footer -->
          <div class="mt-8 text-center border-t border-slate-50 pt-6">
            <p class="text-sm text-slate-500">
              Déjà un compte ? 
              <a routerLink="/auth/login" class="text-indigo-600 font-bold hover:text-indigo-700 transition-colors">Se connecter</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage = '';
  successMessage = '';
  loading = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: passwordMatchValidator });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.registerForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    const { firstName, lastName, email, password } = this.registerForm.value;

    this.authService.register({ firstName, lastName, email, password }).subscribe({
      next: () => {
        this.authService.createUser({ firstName, lastName, email, password }).subscribe({
          next: () => {
            this.loading = false;
            this.successMessage = 'Compte créé ! Redirection vers la connexion...';
            setTimeout(() => this.router.navigate(['/auth/login']), 1500);
          },
          error: (err: Error) => {
            this.loading = false;
            this.errorMessage = err.message;
          }
        });
      },
      error: (err: Error) => {
        this.loading = false;
        this.errorMessage = err.message;
      }
    });
  }
}
