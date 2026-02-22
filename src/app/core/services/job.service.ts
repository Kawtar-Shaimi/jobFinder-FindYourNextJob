import { Injectable } from '@angular/core'; // Remotive Integration
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Job } from '../models/job.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class JobService {
    private baseUrl = environment.remotive.baseUrl;

    constructor(private http: HttpClient) { }

    searchJobs(keyword: string, location: string, page: number = 1): Observable<{ jobs: Job[]; total: number }> {
        // Remotive API doesn't support traditional pagination with a 'page' param in the same way, 
        // but we can simulate it or just fetch the results.
        // Usually: https://remotive.com/api/remote-jobs?search=keyword&limit=20

        let params = new HttpParams();
        if (keyword && keyword.trim()) {
            params = params.set('search', keyword.trim());
        }
        // Remotive is remote-only, so location is less relevant but can be part of search
        if (location && location.trim()) {
            params = params.set('location', location.trim());
        }

        return this.http.get<any>(this.baseUrl, { params }).pipe(
            map(data => {
                const results: any[] = data?.jobs || [];
                const total: number = data?.['0-count'] || results.length;

                const jobs: Job[] = results.map((item: any) => this.mapRemotiveJob(item));

                // Sort by publication date (most recent first)
                jobs.sort((a, b) =>
                    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
                );

                // For testing purposes, we limit to 20 per "page" logic if needed
                return { jobs, total };
            }),
            catchError(() => of({ jobs: [], total: 0 }))
        );
    }

    private mapRemotiveJob(item: any): Job {
        return {
            id: `remotive_${item.id}`,
            title: item.title || 'Poste non précisé',
            company: item.company_name || 'Entreprise non précisée',
            location: item.candidate_required_location || 'Remote',
            description: item.description || 'Aucune description disponible.',
            url: item.url || '#',
            salary: item.salary || undefined,
            publishedAt: item.publication_date || new Date().toISOString(),
            apiSource: 'remotive'
        };
    }
}
