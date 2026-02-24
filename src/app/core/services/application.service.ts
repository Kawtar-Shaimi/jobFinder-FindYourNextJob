import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Application } from '../models/application.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApplicationService {
    private apiUrl = `${environment.jsonServerUrl}/applications`;

    constructor(private http: HttpClient) { }

    getApplicationsByUser(userId: string): Observable<Application[]> {
        return this.http.get<Application[]>(this.apiUrl).pipe(
            map(apps => apps.filter(app => String(app.userId) === String(userId)))
        );
    }

    addApplication(application: Application): Observable<Application> {
        return this.http.post<Application>(this.apiUrl, application);
    }

    updateApplication(id: string, data: Partial<Application>): Observable<Application> {
        return this.http.patch<Application>(`${this.apiUrl}/${id}`, data);
    }

    deleteApplication(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    isAlreadyTracked(userId: string, offerId: string): Observable<Application[]> {
        return this.http.get<Application[]>(this.apiUrl).pipe(
            map(apps => apps.filter(app => String(app.userId) === String(userId) && app.offerId === offerId))
        );
    }
}
