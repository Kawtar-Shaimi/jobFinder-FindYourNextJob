import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApplicationService } from '../../core/services/application.service';
import { AuthService } from '../../core/services/auth.service';
import { Application, ApplicationStatus } from '../../core/models/application.model';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SpinnerComponent],
  template: `
    <div class="min-h-[calc(100vh-64px)] pt-24 pb-16 bg-slate-50">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        <!-- Page Header -->
        <div class="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div class="max-w-2xl">
            <div class="flex items-center gap-3 mb-2">
              <div class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <h1 class="text-3xl font-black text-slate-900 tracking-tight">Mes Candidatures</h1>
            </div>
            <p class="text-slate-500 font-medium">Suivez en temps réel l'évolution de vos démarches professionnelles.</p>
          </div>
          
          <a routerLink="/home" class="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors group">
            Explorer de nouvelles offres
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>
        </div>

        <!-- Filter bar -->
        <div class="flex flex-wrap gap-2 mb-8" *ngIf="applications.length > 0">
          <button
            class="px-5 py-2 rounded-full text-xs font-bold border transition-all"
            [class.bg-slate-900]="activeFilter === 'all'"
            [class.text-white]="activeFilter === 'all'"
            [class.border-slate-900]="activeFilter === 'all'"
            [class.bg-white]="activeFilter !== 'all'"
            [class.text-slate-600]="activeFilter !== 'all'"
            [class.border-slate-200]="activeFilter !== 'all'"
            [class.hover:border-slate-300]="activeFilter !== 'all'"
            (click)="setFilter('all')"
          >Toutes <span class="ml-1 opacity-60">({{ applications.length }})</span></button>
          
          <button
            class="px-5 py-2 rounded-full text-xs font-bold border transition-all"
            [class.bg-indigo-600]="activeFilter === 'en_attente'"
            [class.text-white]="activeFilter === 'en_attente'"
            [class.border-indigo-600]="activeFilter === 'en_attente'"
            [class.bg-white]="activeFilter !== 'en_attente'"
            [class.text-indigo-600]="activeFilter !== 'en_attente'"
            [class.border-indigo-100]="activeFilter !== 'en_attente'"
            (click)="setFilter('en_attente')"
          >En attente <span class="ml-1 opacity-60">({{ countByStatus('en_attente') }})</span></button>
          
          <button
            class="px-5 py-2 rounded-full text-xs font-bold border transition-all"
            [class.bg-emerald-600]="activeFilter === 'accepte'"
            [class.text-white]="activeFilter === 'accepte'"
            [class.border-emerald-600]="activeFilter === 'accepte'"
            [class.bg-white]="activeFilter !== 'accepte'"
            [class.text-emerald-600]="activeFilter !== 'accepte'"
            [class.border-emerald-100]="activeFilter !== 'accepte'"
            (click)="setFilter('accepte')"
          >Acceptées <span class="ml-1 opacity-60">({{ countByStatus('accepte') }})</span></button>
          
          <button
            class="px-5 py-2 rounded-full text-xs font-bold border transition-all"
            [class.bg-red-600]="activeFilter === 'refuse'"
            [class.text-white]="activeFilter === 'refuse'"
            [class.border-red-600]="activeFilter === 'refuse'"
            [class.bg-white]="activeFilter !== 'refuse'"
            [class.text-red-600]="activeFilter !== 'refuse'"
            [class.border-red-100]="activeFilter !== 'refuse'"
            (click)="setFilter('refuse')"
          >Refusées <span class="ml-1 opacity-60">({{ countByStatus('refuse') }})</span></button>
        </div>

        <div *ngIf="loading" class="py-20">
          <app-spinner></app-spinner>
        </div>

        <!-- Empty state -->
        <div *ngIf="!loading && applications.length === 0" 
          class="text-center py-20 px-6 bg-white border border-dashed border-slate-200 rounded-3xl shadow-sm">
          <div class="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-slate-800 mb-2">Aucune candidature suivie</h3>
          <p class="text-slate-500 max-w-sm mx-auto mb-10">Commencez par rechercher des offres et cliquez sur "Suivre ma candidature".</p>
          <a routerLink="/home" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-indigo-100 transition-all">
            Lancer une recherche
          </a>
        </div>

        <!-- Applications List -->
        <div class="space-y-6" *ngIf="!loading && filteredApplications.length > 0">
          <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow" *ngFor="let app of filteredApplications">
            <div class="p-6">
              <div class="flex flex-col md:flex-row justify-between gap-6">
                
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-3 mb-2">
                    <h3 class="text-lg font-bold text-slate-900 truncate">{{ app.title }}</h3>
                    <span [ngClass]="getStatusBadgeClass(app.status)" class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                      {{ getStatusLabel(app.status) }}
                    </span>
                  </div>
                  <div class="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <div class="flex items-center gap-1.5 text-indigo-600 font-bold text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                      {{ app.company }}
                    </div>
                    <div class="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                      {{ app.location }}
                    </div>
                    <div class="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                      Ajouté le {{ app.dateAdded | date:'dd MMM yyyy' }}
                    </div>
                  </div>
                </div>

                <div class="flex items-start gap-2">
                  <div class="p-1 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-1">
                    <select
                      class="bg-transparent border-none text-xs font-bold text-slate-700 focus:ring-0 cursor-pointer"
                      [ngModel]="app.status"
                      (ngModelChange)="updateStatus(app, $event)"
                    >
                      <option value="en_attente">En attente</option>
                      <option value="accepte">Acceptée</option>
                      <option value="refuse">Refusée</option>
                    </select>
                  </div>
                  <a [href]="app.url" target="_blank" class="w-9 h-9 flex items-center justify-center bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors" title="Voir l'annonce">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                  </a>
                  <button (click)="toggleDelete(app)" class="w-9 h-9 flex items-center justify-center bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors" title="Supprimer">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path d="M3 6h18"></path>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Delete confirmation Overlay -->
              <div *ngIf="deletingId === app.id" class="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center justify-between animate-in slide-in-from-top-2 duration-200">
                <span class="text-xs font-bold text-red-700">Supprimer cette candidature de votre suivi ?</span>
                <div class="flex gap-2">
                  <button class="bg-red-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg" (click)="deleteApp(app.id!)">Confirmer</button>
                  <button class="bg-white text-slate-600 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg border border-slate-200" (click)="deletingId = null">Annuler</button>
                </div>
              </div>

              <!-- Notes area -->
              <div class="mt-6 pt-6 border-t border-slate-50">
                <div class="flex items-center gap-2 mb-2 text-slate-500">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span class="text-[10px] font-bold uppercase tracking-widest">Notes & Étapes suivies</span>
                </div>
                <textarea
                  class="w-full bg-slate-50 border-none rounded-xl p-4 text-sm text-slate-700 placeholder:text-slate-300 focus:ring-2 focus:ring-indigo-500/10 min-h-[80px] transition-all"
                  [ngModel]="app.notes"
                  (ngModelChange)="app.notes = $event"
                  (blur)="saveNotes(app)"
                  placeholder="Relancer le recruteur le 15/03, contact RH : Sarah D..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- No filtered results -->
        <div *ngIf="!loading && applications.length > 0 && filteredApplications.length === 0" class="text-center py-20 px-6 bg-slate-50 border border-dashed border-slate-200 rounded-3xl">
          <div class="w-12 h-12 bg-white text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
             <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
               <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
             </svg>
          </div>
          <h3 class="text-lg font-bold text-slate-800">Aucun résultat</h3>
          <p class="text-slate-500 text-sm">Aucune candidature ne correspond à ce filtre pour le moment.</p>
        </div>

      </div>
    </div>
  `,
  styles: []
})
export class ApplicationsComponent implements OnInit {
  applications: Application[] = [];
  filteredApplications: Application[] = [];
  loading = false;
  activeFilter = 'all';
  deletingId: number | null = null;

  constructor(
    private applicationService: ApplicationService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    this.loading = true;
    this.applicationService.getApplicationsByUser(user.id).subscribe({
      next: (apps) => {
        this.applications = apps;
        this.applyFilter();
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  setFilter(filter: string): void {
    this.activeFilter = filter;
    this.applyFilter();
  }

  applyFilter(): void {
    if (this.activeFilter === 'all') {
      this.filteredApplications = [...this.applications];
    } else {
      this.filteredApplications = this.applications.filter(a => a.status === this.activeFilter);
    }
  }

  countByStatus(status: ApplicationStatus): number {
    return this.applications.filter(a => a.status === status).length;
  }

  getStatusBadgeClass(status: ApplicationStatus): string {
    const map: Record<ApplicationStatus, string> = {
      'en_attente': 'bg-indigo-50 text-indigo-700',
      'accepte': 'bg-emerald-50 text-emerald-700',
      'refuse': 'bg-red-50 text-red-700'
    };
    return map[status] || 'bg-slate-50 text-slate-700';
  }

  getStatusLabel(status: ApplicationStatus): string {
    const map: Record<ApplicationStatus, string> = {
      'en_attente': 'En attente',
      'accepte': 'Acceptée',
      'refuse': 'Refusée'
    };
    return map[status] || status;
  }

  updateStatus(app: Application, newStatus: ApplicationStatus): void {
    app.status = newStatus;
    this.applicationService.updateApplication(app.id!, { status: newStatus }).subscribe({
      next: () => this.applyFilter()
    });
  }

  saveNotes(app: Application): void {
    this.applicationService.updateApplication(app.id!, { notes: app.notes }).subscribe();
  }

  toggleDelete(app: Application): void {
    this.deletingId = this.deletingId === app.id ? null : app.id!;
  }

  deleteApp(id: number): void {
    this.applicationService.deleteApplication(id).subscribe({
      next: () => {
        this.applications = this.applications.filter(a => a.id !== id);
        this.applyFilter();
        this.deletingId = null;
      }
    });
  }
}
