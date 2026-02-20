import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { AuthUser } from '../../core/models/user.model';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const pwd = control.get('newPassword');
    const confirm = control.get('confirmPassword');
    if (pwd?.value && confirm?.value && pwd.value !== confirm.value) {
        return { passwordMismatch: true };
    }
    return null;
}

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule],
    template: `
    <div class="page-container">
      <div class="container">
        <div class="page-header">
          <h1>👤 Mon Profil</h1>
          <p class="text-muted">Gérez vos informations personnelles</p>
        </div>

        <div class="profile-layout">

          <!-- Profile card -->
          <div class="profile-summary card">
            <div class="avatar">{{ initials }}</div>
            <h2 class="profile-name">{{ currentUser?.firstName }} {{ currentUser?.lastName }}</h2>
            <p class="profile-email text-muted">{{ currentUser?.email }}</p>
            <span class="badge badge-primary">Candidat actif</span>
          </div>

          <!-- Edit form -->
          <div class="profile-form card">
            <h3 class="section-title">Modifier mes informations</h3>

            <div *ngIf="successMessage" class="alert alert-success">{{ successMessage }}</div>
            <div *ngIf="errorMessage" class="alert alert-error">{{ errorMessage }}</div>

            <form [formGroup]="profileForm" (ngSubmit)="onSave()">
              <div class="form-row">
                <div class="form-group">
                  <label for="firstName">Prénom</label>
                  <input
                    id="firstName"
                    type="text"
                    class="form-control"
                    [class.is-invalid]="isInvalid('firstName')"
                    formControlName="firstName"
                  />
                  <span *ngIf="isInvalid('firstName')" class="error-text">Prénom obligatoire.</span>
                </div>
                <div class="form-group">
                  <label for="lastName">Nom</label>
                  <input
                    id="lastName"
                    type="text"
                    class="form-control"
                    [class.is-invalid]="isInvalid('lastName')"
                    formControlName="lastName"
                  />
                  <span *ngIf="isInvalid('lastName')" class="error-text">Nom obligatoire.</span>
                </div>
              </div>

              <div class="form-group">
                <label for="email">Email</label>
                <input
                  id="email"
                  type="email"
                  class="form-control"
                  [class.is-invalid]="isInvalid('email')"
                  formControlName="email"
                />
                <span *ngIf="isInvalid('email')" class="error-text">Email invalide.</span>
              </div>

              <div class="password-section">
                <p class="section-hint text-muted">Laissez vide pour garder le mot de passe actuel</p>

                <div class="form-group" formGroupName="passwords">
                  <label for="newPassword">Nouveau mot de passe</label>
                  <input
                    id="newPassword"
                    type="password"
                    class="form-control"
                    formControlName="newPassword"
                    placeholder="Minimum 6 caractères"
                  />
                </div>

                <div class="form-group" formGroupName="passwords">
                  <label for="confirmPassword">Confirmer le mot de passe</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    class="form-control"
                    [class.is-invalid]="profileForm.get('passwords')?.errors?.['passwordMismatch'] && profileForm.get('passwords.confirmPassword')?.touched"
                    formControlName="confirmPassword"
                    placeholder="Répétez le mot de passe"
                  />
                  <span class="error-text" *ngIf="profileForm.get('passwords')?.errors?.['passwordMismatch'] && profileForm.get('passwords.confirmPassword')?.touched">
                    Les mots de passe ne correspondent pas.
                  </span>
                </div>
              </div>

              <div class="form-actions">
                <button type="submit" class="btn btn-primary" [disabled]="loading">
                  {{ loading ? 'Enregistrement...' : '💾 Enregistrer' }}
                </button>
                <button type="button" class="btn btn-ghost" (click)="resetForm()">Annuler</button>
              </div>
            </form>

            <!-- Delete account -->
            <div class="danger-zone">
              <h4 class="danger-title">Zone de danger</h4>
              <p class="text-muted" style="font-size: 0.875rem; margin-bottom: 0.75rem;">
                La suppression de votre compte est irréversible.
              </p>
              <button
                *ngIf="!confirmDelete"
                class="btn btn-danger btn-sm"
                (click)="confirmDelete = true"
              >
                🗑️ Supprimer mon compte
              </button>
              <div *ngIf="confirmDelete" class="delete-confirm">
                <p class="text-muted" style="font-size: 0.875rem;">Êtes-vous sûr(e) ?</p>
                <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
                  <button class="btn btn-danger btn-sm" (click)="deleteAccount()">Confirmer la suppression</button>
                  <button class="btn btn-ghost btn-sm" (click)="confirmDelete = false">Annuler</button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  `,
    styles: [`
    .page-container { padding: 2rem 0 3rem; }
    .page-header { margin-bottom: 2rem; }
    .page-header h1 { font-size: 1.8rem; }

    .profile-layout {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 1.5rem;
      align-items: start;
    }

    @media (max-width: 768px) {
      .profile-layout { grid-template-columns: 1fr; }
    }

    .profile-summary {
      padding: 2rem 1.5rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
    }

    .avatar {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      font-weight: 700;
    }

    .profile-name {
      font-size: 1.1rem;
      font-weight: 600;
    }

    .profile-email {
      font-size: 0.85rem;
    }

    .profile-form { padding: 1.75rem; }
    .section-title { font-size: 1rem; margin-bottom: 1.25rem; }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
    }
    @media (max-width: 480px) { .form-row { grid-template-columns: 1fr; } }

    .password-section {
      border-top: 1px solid var(--border);
      padding-top: 1.25rem;
      margin-top: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .section-hint { font-size: 0.8rem; margin-bottom: 0.75rem; }

    .form-actions {
      display: flex;
      gap: 0.75rem;
      margin-top: 1.25rem;
      flex-wrap: wrap;
    }

    .danger-zone {
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px dashed #FECACA;
    }

    .danger-title {
      font-size: 0.9rem;
      color: var(--danger);
      margin-bottom: 0.5rem;
    }

    .delete-confirm {
      padding: 1rem;
      background: #FEF2F2;
      border-radius: var(--radius-sm);
      border: 1px solid #FECACA;
    }
  `]
})
export class ProfileComponent implements OnInit {
    profileForm!: FormGroup;
    currentUser: AuthUser | null = null;
    loading = false;
    successMessage = '';
    errorMessage = '';
    confirmDelete = false;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) { }

    get initials(): string {
        if (!this.currentUser) return '?';
        return (this.currentUser.firstName[0] + this.currentUser.lastName[0]).toUpperCase();
    }

    ngOnInit(): void {
        this.currentUser = this.authService.getCurrentUser();
        this.initForm();
    }

    initForm(): void {
        this.profileForm = this.fb.group({
            firstName: [this.currentUser?.firstName || '', [Validators.required, Validators.minLength(2)]],
            lastName: [this.currentUser?.lastName || '', [Validators.required, Validators.minLength(2)]],
            email: [this.currentUser?.email || '', [Validators.required, Validators.email]],
            passwords: this.fb.group({
                newPassword: ['', [Validators.minLength(6)]],
                confirmPassword: ['']
            }, { validators: passwordMatchValidator })
        });
    }

    isInvalid(field: string): boolean {
        const control = this.profileForm.get(field);
        return !!(control?.invalid && (control?.dirty || control?.touched));
    }

    resetForm(): void {
        this.initForm();
        this.successMessage = '';
        this.errorMessage = '';
    }

    onSave(): void {
        if (this.profileForm.invalid) {
            this.profileForm.markAllAsTouched();
            return;
        }

        this.loading = true;
        this.errorMessage = '';
        this.successMessage = '';

        const { firstName, lastName, email, passwords } = this.profileForm.value;
        const updateData: any = { firstName, lastName, email };

        if (passwords.newPassword) {
            updateData.password = passwords.newPassword;
        }

        this.authService.updateUser(this.currentUser!.id, updateData).subscribe({
            next: () => {
                this.loading = false;
                this.currentUser = this.authService.getCurrentUser();
                this.successMessage = 'Profil mis à jour avec succès !';
                this.profileForm.get('passwords')?.reset();
                setTimeout(() => this.successMessage = '', 3000);
            },
            error: (err) => {
                this.loading = false;
                this.errorMessage = err.message;
            }
        });
    }

    deleteAccount(): void {
        this.authService.deleteUser(this.currentUser!.id).subscribe({
            next: () => {
                this.authService.logout();
                this.router.navigate(['/home']);
            },
            error: (err) => {
                this.errorMessage = err.message;
                this.confirmDelete = false;
            }
        });
    }
}
