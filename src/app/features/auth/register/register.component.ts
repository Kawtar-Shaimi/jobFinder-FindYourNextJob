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
    <div class="auth-page">
      <div class="auth-card card">
        <div class="auth-header">
          <div class="auth-logo">🚀</div>
          <h1>Créer un compte</h1>
          <p class="text-muted">Rejoignez JobFinder et trouvez votre prochain emploi</p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div *ngIf="errorMessage" class="alert alert-error">{{ errorMessage }}</div>
          <div *ngIf="successMessage" class="alert alert-success">{{ successMessage }}</div>

          <div class="form-row">
            <div class="form-group">
              <label for="firstName">Prénom</label>
              <input
                id="firstName"
                type="text"
                class="form-control"
                [class.is-invalid]="isFieldInvalid('firstName')"
                formControlName="firstName"
                placeholder="Votre prénom"
              />
              <span *ngIf="isFieldInvalid('firstName')" class="error-text">Prénom obligatoire.</span>
            </div>
            <div class="form-group">
              <label for="lastName">Nom</label>
              <input
                id="lastName"
                type="text"
                class="form-control"
                [class.is-invalid]="isFieldInvalid('lastName')"
                formControlName="lastName"
                placeholder="Votre nom"
              />
              <span *ngIf="isFieldInvalid('lastName')" class="error-text">Nom obligatoire.</span>
            </div>
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
              {{ registerForm.get('email')?.errors?.['email'] ? 'Email invalide.' : 'Email obligatoire.' }}
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
                placeholder="Minimum 6 caractères"
              />
              <button type="button" class="toggle-pwd" (click)="showPassword = !showPassword">
                {{ showPassword ? '🙈' : '👁️' }}
              </button>
            </div>
            <span *ngIf="isFieldInvalid('password')" class="error-text">
              Minimum 6 caractères.
            </span>
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirmer le mot de passe</label>
            <input
              id="confirmPassword"
              type="password"
              class="form-control"
              [class.is-invalid]="isFieldInvalid('confirmPassword') || registerForm.errors?.['passwordMismatch']"
              formControlName="confirmPassword"
              placeholder="Répétez le mot de passe"
            />
            <span *ngIf="registerForm.errors?.['passwordMismatch'] && registerForm.get('confirmPassword')?.touched" class="error-text">
              Les mots de passe ne correspondent pas.
            </span>
          </div>

          <button
            type="submit"
            class="btn btn-primary btn-lg w-full"
            [disabled]="loading"
          >
            <span *ngIf="loading" class="btn-spinner"></span>
            {{ loading ? 'Création...' : 'Créer mon compte' }}
          </button>
        </form>

        <p class="auth-footer text-muted">
          Déjà un compte ?
          <a routerLink="/auth/login">Se connecter</a>
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
      max-width: 480px;
      padding: 2.5rem;
    }
    .auth-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    .auth-logo { font-size: 2.5rem; margin-bottom: 0.75rem; }
    .auth-header h1 { font-size: 1.5rem; margin-bottom: 0.4rem; }
    .auth-header p { font-size: 0.875rem; }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
    }
    @media (max-width: 480px) { .form-row { grid-template-columns: 1fr; } }

    .input-wrapper { position: relative; display: flex; }
    .input-wrapper .form-control { padding-right: 2.8rem; }
    .toggle-pwd {
      position: absolute; right: 0.75rem; top: 50%;
      transform: translateY(-50%);
      background: none; border: none; cursor: pointer; font-size: 1rem;
    }

    .w-full { width: 100%; justify-content: center; }
    .auth-footer { text-align: center; margin-top: 1.5rem; font-size: 0.875rem; }

    .btn-spinner {
      width: 14px; height: 14px;
      border: 2px solid rgba(255,255,255,0.4);
      border-top-color: white; border-radius: 50%;
      animation: spin 0.75s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
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
            this.successMessage = 'Compte créé ! Redirection...';
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
