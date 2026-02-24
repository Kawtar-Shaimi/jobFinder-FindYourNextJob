import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { User, AuthUser } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = `${environment.jsonServerUrl}/users`;
    private storageKey = 'jobfinder_user';

    constructor(private http: HttpClient) { }

    register(user: User): Observable<void> {
        return this.http.get<User[]>(`${this.apiUrl}?email=${user.email}`).pipe(
            map(users => {
                if (users.length > 0) {
                    throw new Error('Cet email est déjà utilisé.');
                }
            }),
            catchError(err => throwError(() => err))
        );
    }

    createUser(user: User): Observable<User> {
        return this.http.post<User>(this.apiUrl, user);
    }

    login(email: string, password: string): Observable<AuthUser> {
        return this.http.get<User[]>(`${this.apiUrl}?email=${email}&password=${password}`).pipe(
            map(users => {
                if (users.length === 0) {
                    throw new Error('Email ou mot de passe incorrect.');
                }
                const user = users[0];
                const authUser: AuthUser = {
                    id: String(user.id),
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email
                };
                sessionStorage.setItem(this.storageKey, JSON.stringify(authUser));
                return authUser;
            }),
            catchError(err => throwError(() => err))
        );
    }

    logout(): void {
        sessionStorage.removeItem(this.storageKey);
    }

    getCurrentUser(): AuthUser | null {
        try {
            const data = sessionStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Error parsing user session:', e);
            sessionStorage.removeItem(this.storageKey);
            return null;
        }
    }

    isLoggedIn(): boolean {
        return !!this.getCurrentUser();
    }

    updateUser(id: string, data: Partial<User>): Observable<User> {
        return this.http.patch<User>(`${this.apiUrl}/${id}`, data).pipe(
            map(user => {
                const authUser: AuthUser = {
                    id: String(user.id),
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email
                };
                sessionStorage.setItem(this.storageKey, JSON.stringify(authUser));
                return user;
            })
        );
    }

    deleteUser(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    getUserById(id: string): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/${id}`);
    }
}
