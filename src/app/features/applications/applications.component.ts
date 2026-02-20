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
    <div class="page-container">
      <div class="container">

        <div class="page-header">
          <h1>📋 Mes Candidatures</h1>
          <p class="text-muted">Suivez l'avancement de vos candidatures</p>
        </div>

        <!-- Filter bar -->
        <div class="filter-bar" *ngIf="applications.length > 0">
          <button
            class="filter-btn"
            [class.active]="activeFilter === 'all'"
            (click)="setFilter('all')"
          >Toutes ({{ applications.length }})</button>
          <button
            class="filter-btn filter-waiting"
            [class.active]="activeFilter === 'en_attente'"
            (click)="setFilter('en_attente')"
          >En attente ({{ countByStatus('en_attente') }})</button>
          <button
            class="filter-btn filter-accepted"
            [class.active]="activeFilter === 'accepte'"
            (click)="setFilter('accepte')"
          >Acceptées ({{ countByStatus('accepte') }})</button>
          <button
            class="filter-btn filter-refused"
            [class.active]="activeFilter === 'refuse'"
            (click)="setFilter('refuse')"
          >Refusées ({{ countByStatus('refuse') }})</button>
        </div>

        <app-spinner *ngIf="loading"></app-spinner>

        <!-- Empty state -->
        <div *ngIf="!loading && applications.length === 0" class="empty-state">
          <div class="empty-state-icon">📋</div>
          <h3>Aucune candidature suivie</h3>
          <p>Ajoutez des offres à votre suivi depuis la page de recherche.</p>
          <a routerLink="/home" class="btn btn-primary">Rechercher des offres</a>
        </div>

        <!-- Applications List -->
        <div class="apps-list" *ngIf="!loading && filteredApplications.length > 0">
          <div class="app-card card" *ngFor="let app of filteredApplications">
            <div class="app-header">
              <div class="app-info">
                <h3 class="app-title">{{ app.title }}</h3>
                <p class="app-company">{{ app.company }}</p>
              </div>
              <div class="app-status-section">
                <span class="badge" [ngClass]="getStatusClass(app.status)">
                  {{ getStatusLabel(app.status) }}
                </span>
                <button class="btn-icon" (click)="toggleDelete(app)" title="Supprimer">🗑️</button>
              </div>
            </div>

            <div class="app-meta">
              <span class="meta-item">📍 {{ app.location }}</span>
              <span class="meta-item">📅 Ajouté le {{ app.dateAdded | date:'dd/MM/yyyy' }}</span>
            </div>

            <!-- Status change -->
            <div class="app-controls">
              <select
                class="form-control status-select"
                [ngModel]="app.status"
                (ngModelChange)="updateStatus(app, $event)"
              >
                <option value="en_attente">⏳ En attente</option>
                <option value="accepte">✅ Acceptée</option>
                <option value="refuse">❌ Refusée</option>
              </select>

              <a [href]="app.url" target="_blank" class="btn btn-outline btn-sm">Voir l'offre ↗</a>
            </div>

            <!-- Notes section -->
            <div class="notes-section">
              <label class="notes-label">📝 Notes personnelles</label>
              <textarea
                class="form-control notes-field"
                [ngModel]="app.notes"
                (ngModelChange)="app.notes = $event"
                (blur)="saveNotes(app)"
                placeholder="Ajoutez vos notes ici (date de relance, contacts, retours...)"
                rows="2"
              ></textarea>
            </div>

            <!-- Delete confirm -->
            <div *ngIf="deletingId === app.id" class="delete-confirm alert alert-error">
              <span>Supprimer cette candidature ?</span>
              <div style="display:flex; gap:0.5rem; margin-top:0.5rem;">
                <button class="btn btn-danger btn-sm" (click)="deleteApp(app.id!)">Supprimer</button>
                <button class="btn btn-ghost btn-sm" (click)="deletingId = null">Annuler</button>
              </div>
            </div>
          </div>
        </div>

        <!-- No filtered results -->
        <div *ngIf="!loading && applications.length > 0 && filteredApplications.length === 0" class="empty-state">
          <div class="empty-state-icon">🔎</div>
          <h3>Aucune candidature dans cette catégorie</h3>
        </div>

      </div>
    </div>
  `,
    styles: [`
    .page-container { padding: 2rem 0 3rem; }
    .page-header { margin-bottom: 1.5rem; }
    .page-header h1 { font-size: 1.8rem; }

    .filter-bar {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin-bottom: 1.5rem;
    }
    .filter-btn {
      padding: 0.4rem 0.9rem;
      border-radius: 20px;
      border: 1.5px solid var(--border);
      font-size: 0.8rem;
      font-weight: 500;
      cursor: pointer;
      background: var(--card);
      color: var(--text-secondary);
      transition: all var(--transition);
      font-family: inherit;
    }
    .filter-btn:hover, .filter-btn.active {
      background: var(--primary);
      border-color: var(--primary);
      color: white;
    }
    .filter-btn.filter-waiting.active { background: var(--primary); border-color: var(--primary); }
    .filter-btn.filter-accepted.active { background: var(--success); border-color: var(--success); }
    .filter-btn.filter-refused.active { background: var(--danger); border-color: var(--danger); }

    .apps-list { display: flex; flex-direction: column; gap: 1rem; }

    .app-card {
      padding: 1.25rem 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .app-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;
    }

    .app-title {
      font-size: 0.95rem;
      font-weight: 600;
      margin-bottom: 0.2rem;
    }

    .app-company {
      font-size: 0.85rem;
      color: var(--primary);
      font-weight: 500;
    }

    .app-status-section {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-shrink: 0;
    }

    .app-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }
    .meta-item { font-size: 0.8rem; color: var(--text-secondary); }

    .app-controls {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .status-select {
      width: auto;
      padding: 0.4rem 0.75rem;
      font-size: 0.85rem;
    }

    .notes-section { display: flex; flex-direction: column; gap: 0.3rem; }
    .notes-label { font-size: 0.8rem; color: var(--text-secondary); font-weight: 500; }
    .notes-field { font-size: 0.85rem; resize: vertical; min-height: 60px; }

    .delete-confirm { padding: 0.75rem 1rem; margin-top: 0.25rem; }
  `]
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

    getStatusClass(status: ApplicationStatus): string {
        const map: Record<ApplicationStatus, string> = {
            'en_attente': 'badge-primary',
            'accepte': 'badge-success',
            'refuse': 'badge-danger'
        };
        return map[status] || 'badge-primary';
    }

    getStatusLabel(status: ApplicationStatus): string {
        const map: Record<ApplicationStatus, string> = {
            'en_attente': '⏳ En attente',
            'accepte': '✅ Acceptée',
            'refuse': '❌ Refusée'
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
