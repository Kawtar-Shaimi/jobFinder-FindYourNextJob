import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FavoriteOffer } from '../models/favorite.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class FavoriteService {
    private apiUrl = `${environment.jsonServerUrl}/favoritesOffers`;

    constructor(private http: HttpClient) { }

    getFavoritesByUser(userId: number): Observable<FavoriteOffer[]> {
        return this.http.get<FavoriteOffer[]>(`${this.apiUrl}?userId=${userId}`);
    }

    addFavorite(favorite: FavoriteOffer): Observable<FavoriteOffer> {
        return this.http.post<FavoriteOffer>(this.apiUrl, favorite);
    }

    removeFavorite(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    isFavorite(userId: number, offerId: string): Observable<FavoriteOffer[]> {
        return this.http.get<FavoriteOffer[]>(`${this.apiUrl}?userId=${userId}&offerId=${offerId}`);
    }
}
