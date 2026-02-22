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
    <div class="min-h-[calc(100vh-64px)] pt-24 pb-16 bg-slate-50">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Page Header -->
        <div class="mb-10">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <h1 class="text-3xl font-black text-slate-900 tracking-tight">Mon Profil</h1>
          </div>
          <p class="text-slate-500 font-medium">Gérez vos informations personnelles et la sécurité de votre compte.</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">

          <!-- Left Column: Profile Summary -->
          <div class="lg:col-span-4">
            <div class="bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-sm">
              <div class="w-24 h-24 bg-gradient-to-br from-indigo-600 to-indigo-400 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-black shadow-inner">
                {{ initials }}
              </div>
              <h2 class="text-xl font-bold text-slate-900 mb-1">{{ currentUser?.firstName }} {{ currentUser?.lastName }}</h2>
              <p class="text-slate-500 text-sm mb-6">{{ currentUser?.email }}</p>
              <div class="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Candidat vérifié
              </div>
            </div>
          </div>

          <!-- Right Column: Edit Form -->
          <div class="lg:col-span-8 space-y-8">
            <div class="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
              <h3 class="text-sm font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Informations du compte
              </h3>

              <div *ngIf="successMessage" class="mb-6 bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-3 rounded-xl text-sm font-medium animate-in fade-in duration-300">
                {{ successMessage }}
              </div>
              <div *ngIf="errorMessage" class="mb-6 bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl text-sm font-medium animate-in fade-in duration-300">
                {{ errorMessage }}
              </div>

              <form [formGroup]="profileForm" (ngSubmit)="onSave()" class="space-y-6">
                <!-- Name Row -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-1.5">
                    <label for="firstName" class="block text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Prénom</label>
                    <input
                      id="firstName"
                      type="text"
                      class="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                      formControlName="firstName"
                    />
                    <p *ngIf="isInvalid('firstName')" class="text-red-500 text-[11px] font-bold ml-1">Prénom obligatoire.</p>
                  </div>
                  <div class="space-y-1.5">
                    <label for="lastName" class="block text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Nom</label>
                    <input
                      id="lastName"
                      type="text"
                      class="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                      formControlName="lastName"
                    />
                    <p *ngIf="isInvalid('lastName')" class="text-red-500 text-[11px] font-bold ml-1">Nom obligatoire.</p>
                  </div>
                </div>

                <!-- Email -->
                <div class="space-y-1.5">
                  <label for="email" class="block text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Expertise & Contact</label>
                  <input
                    id="email"
                    type="email"
                    class="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                    formControlName="email"
                  />
                  <p *ngIf="isInvalid('email')" class="text-red-500 text-[11px] font-bold ml-1">Email invalide.</p>
                </div>

                <!-- Password Section -->
                <div class="pt-6 border-t border-slate-50">
                  <div class="flex items-center gap-2 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                    <h4 class="text-xs font-bold text-slate-500 uppercase tracking-widest">Changer le mot de passe</h4>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6" formGroupName="passwords">
                    <div class="space-y-1.5">
                      <label for="newPassword" class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Nouveau</label>
                      <input
                        id="newPassword"
                        type="password"
                        class="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                        formControlName="newPassword"
                        placeholder="••••••••"
                      />
                    </div>
                    <div class="space-y-1.5">
                      <label for="confirmPassword" class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Confirmation</label>
                      <input
                        id="confirmPassword"
                        type="password"
                        class="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                        formControlName="confirmPassword"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  <p class="text-red-500 text-[11px] font-bold mt-2 ml-1" *ngIf="profileForm.get('passwords')?.errors?.['passwordMismatch'] && profileForm.get('passwords.confirmPassword')?.touched">
                    Les mots de passe ne correspondent pas.
                  </p>
                </div>

                <!-- Actions -->
                <div class="flex items-center gap-3 pt-6">
                  <button type="submit" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-95 disabled:opacity-70 flex items-center gap-2" [disabled]="loading">
                    <svg *ngIf="!loading" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                      <polyline points="17 21 17 13 7 13 7 21"></polyline>
                      <polyline points="7 3 7 8 15 8"></polyline>
                    </svg>
                    <div *ngIf="loading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Enregistrer
                  </button>
                  <button type="button" class="px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors" (click)="resetForm()">Annuler</button>
                </div>
              </form>
            </div>

            <!-- Danger Zone -->
            <div class="bg-red-50/50 border border-red-100 rounded-3xl p-8">
              <h4 class="text-sm font-black text-red-700 uppercase tracking-widest mb-2 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Zone de danger
              </h4>
              <p class="text-slate-500 text-xs mb-6">La suppression de votre compte est irréversible et effacera toutes vos données de candidature.</p>
              
              <button
                *ngIf="!confirmDelete"
                class="text-red-600 font-bold text-xs hover:text-red-700 transition-colors flex items-center gap-2"
                (click)="confirmDelete = true"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
                Supprimer définitivement mon compte
              </button>

              <div *ngIf="confirmDelete" class="bg-white border border-red-200 rounded-2xl p-6 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
                <p class="text-slate-900 font-bold text-sm mb-4">Êtes-vous absolument sûr(e) ?</p>
                <div class="flex gap-3">
                  <button class="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-lg shadow-red-100 transition-all" (click)="deleteAccount()">Supprimer le compte</button>
                  <button class="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs px-6 py-2.5 rounded-xl transition-all" (click)="confirmDelete = false">Annuler</button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: []
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
