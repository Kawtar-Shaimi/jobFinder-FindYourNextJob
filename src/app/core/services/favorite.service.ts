import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { FavoriteOffer } from '../models/favorite.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class FavoriteService {
    private apiUrl = `${environment.jsonServerUrl}/favoritesOffers`;

    constructor(private http: HttpClient) { }

    getFavoritesByUser(userId: string): Observable<FavoriteOffer[]> {
        return this.http.get<FavoriteOffer[]>(this.apiUrl).pipe(
            map(favs => favs.filter(f => String(f.userId) === String(userId)))
        );
    }

    addFavorite(favorite: FavoriteOffer): Observable<FavoriteOffer> {
        return this.http.post<FavoriteOffer>(this.apiUrl, favorite);
    }

    removeFavorite(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    isFavorite(userId: string, offerId: string): Observable<FavoriteOffer[]> {
        return this.http.get<FavoriteOffer[]>(this.apiUrl).pipe(
            map(favs => favs.filter(f => String(f.userId) === String(userId) && f.offerId === offerId))
        );
    }
}
