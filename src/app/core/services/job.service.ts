import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Job } from '../models/job.model';

@Injectable({
    providedIn: 'root'
})
export class JobService {
    // Adzuna API
    private adzunaAppId = 'your_adzuna_app_id';
    private adzunaApiKey = 'your_adzuna_api_key';
    private adzunaBaseUrl = 'https://api.adzuna.com/v1/api/jobs';

    constructor(private http: HttpClient) { }

    searchJobs(keyword: string, location: string, page: number = 1): Observable<{ jobs: Job[]; total: number }> {
        return this.searchAdzuna(keyword, location, page);
    }

    private searchAdzuna(keyword: string, location: string, page: number): Observable<{ jobs: Job[]; total: number }> {
        let params = new HttpParams()
            .set('app_id', this.adzunaAppId)
            .set('app_key', this.adzunaApiKey)
            .set('results_per_page', '10')
            .set('what', keyword)
            .set('content-type', 'application/json');

        if (location) {
            params = params.set('where', location);
        }

        const url = `${this.adzunaBaseUrl}/gb/${page}`;

        return this.http.get<any>(url, { params }).pipe(
            map(data => {
                const total = data?.count || 0;
                const results: any[] = data?.results || [];
                const jobs: Job[] = results
                    .filter((item: any) => {
                        const title = (item.title || '').toLowerCase();
                        const kw = keyword.toLowerCase();
                        return title.includes(kw);
                    })
                    .map((item: any) => this.mapAdzunaJob(item));

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
            description: item.description || '',
            url: item.redirect_url || '',
            salary: item.salary_min
                ? `${Math.round(item.salary_min)}€ - ${Math.round(item.salary_max || item.salary_min)}€`
                : undefined,
            publishedAt: item.created || new Date().toISOString(),
            apiSource: 'adzuna'
        };
    }
}
