import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Job } from '../models/job.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class JobService {
    private appId = environment.adzuna.appId;
    private apiKey = environment.adzuna.apiKey;
    private baseUrl = environment.adzuna.baseUrl;

    constructor(private http: HttpClient) { }

    searchJobs(keyword: string, location: string, page: number = 1): Observable<{ jobs: Job[]; total: number }> {
        return this.searchAdzuna(keyword, location, page);
    }

    private searchAdzuna(keyword: string, location: string, page: number): Observable<{ jobs: Job[]; total: number }> {
        let params = new HttpParams()
            .set('app_id', this.appId)
            .set('app_key', this.apiKey)
            .set('results_per_page', '20')
            .set('what', keyword)
            .set('content-type', 'application/json');

        if (location && location.trim()) {
            params = params.set('where', location.trim());
        }

        const url = `${this.baseUrl}/gb/${page}`;

        return this.http.get<any>(url, { params }).pipe(
            map(data => {
                const total: number = data?.count || 0;
                const results: any[] = data?.results || [];

                // Filtre : uniquement les offres dont le TITRE contient le mot-clé
                const filtered = keyword
                    ? results.filter((item: any) =>
                        (item.title || '').toLowerCase().includes(keyword.toLowerCase())
                    )
                    : results;

                const jobs: Job[] = filtered.map((item: any) => this.mapAdzunaJob(item));

                // Tri par date de publication (plus récent en premier)
                jobs.sort((a, b) =>
                    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
                );

                return { jobs, total };
            }),
            catchError(() => of({ jobs: [], total: 0 }))
        );
    }

    private mapAdzunaJob(item: any): Job {
        return {
            id: `adzuna_${item.id}`,
            title: item.title || 'Poste non précisé',
            company: item.company?.display_name || 'Entreprise non précisée',
            location: item.location?.display_name || 'Localisation non précisée',
            description: item.description || 'Aucune description disponible.',
            url: item.redirect_url || '#',
            salary: item.salary_min
                ? `${this.formatSalary(item.salary_min)} - ${this.formatSalary(item.salary_max || item.salary_min)} £`
                : undefined,
            publishedAt: item.created || new Date().toISOString(),
            apiSource: 'adzuna'
        };
    }

    private formatSalary(value: number): string {
        return Math.round(value).toLocaleString('fr-FR');
    }
}
