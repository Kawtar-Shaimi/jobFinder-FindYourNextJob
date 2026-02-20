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
    <div class="auth-page">
      <div class="auth-card card">
        <div class="auth-header">
          <div class="auth-logo">💼</div>
          <h1>Bon retour !</h1>
          <p class="text-muted">Connectez-vous pour accéder à vos favoris et candidatures</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div *ngIf="errorMessage" class="alert alert-error">
            {{ errorMessage }}
          </div>

          <div class="form-group">
            <label for="email">Adresse email</label>
            <input
              id="email"
              type="email"
              class="form-control"
              [class.is-invalid]="isFieldInvalid('email')"
              formControlName="email"
              placeholder="votre@email.com"
            />
            <span *ngIf="isFieldInvalid('email')" class="error-text">
              {{ getFieldError('email') }}
            </span>
          </div>

          <div class="form-group">
            <label for="password">Mot de passe</label>
            <div class="input-wrapper">
              <input
                id="password"
                [type]="showPassword ? 'text' : 'password'"
                class="form-control"
                [class.is-invalid]="isFieldInvalid('password')"
                formControlName="password"
                placeholder="Votre mot de passe"
              />
              <button type="button" class="toggle-pwd" (click)="showPassword = !showPassword">
                {{ showPassword ? '🙈' : '👁️' }}
              </button>
            </div>
            <span *ngIf="isFieldInvalid('password')" class="error-text">
              {{ getFieldError('password') }}
            </span>
          </div>

          <button
            type="submit"
            class="btn btn-primary btn-lg w-full"
            [disabled]="loading"
          >
            <span *ngIf="loading" class="btn-spinner"></span>
            {{ loading ? 'Connexion...' : 'Se connecter' }}
          </button>
        </form>

        <p class="auth-footer text-muted">
          Pas encore de compte ?
          <a routerLink="/auth/register">Créer un compte</a>
        </p>
      </div>
    </div>
  `,
    styles: [`
    .auth-page {
      min-height: calc(100vh - 64px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem 1rem;
      background: linear-gradient(135deg, #f0f5ff 0%, #f8fafc 100%);
    }

    .auth-card {
      width: 100%;
      max-width: 420px;
      padding: 2.5rem;
    }

    .auth-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    .auth-logo {
      font-size: 2.5rem;
      margin-bottom: 0.75rem;
    }
    .auth-header h1 {
      font-size: 1.5rem;
      margin-bottom: 0.4rem;
    }
    .auth-header p { font-size: 0.875rem; }

    .input-wrapper {
      position: relative;
      display: flex;
    }
    .input-wrapper .form-control { padding-right: 2.8rem; }
    .toggle-pwd {
      position: absolute;
      right: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1rem;
      line-height: 1;
      padding: 0.1rem;
    }

    .w-full { width: 100%; justify-content: center; }

    .auth-footer {
      text-align: center;
      margin-top: 1.5rem;
      font-size: 0.875rem;
    }

    .btn-spinner {
      width: 14px;
      height: 14px;
      border: 2px solid rgba(255,255,255,0.4);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.75s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
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
