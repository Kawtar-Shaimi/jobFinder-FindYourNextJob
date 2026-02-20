import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { FavoriteService } from '../../core/services/favorite.service';
import * as FavoritesActions from './favorites.actions';

@Injectable()
export class FavoritesEffects {
    constructor(
        private actions$: Actions,
        private favoriteService: FavoriteService
    ) { }

    loadFavorites$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FavoritesActions.loadFavorites),
            mergeMap(({ userId }) =>
                this.favoriteService.getFavoritesByUser(userId).pipe(
                    map(favorites => FavoritesActions.loadFavoritesSuccess({ favorites })),
                    catchError(err => of(FavoritesActions.loadFavoritesFailure({ error: err.message })))
                )
            )
        )
    );

    addFavorite$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FavoritesActions.addFavorite),
            mergeMap(({ favorite }) =>
                this.favoriteService.addFavorite(favorite).pipe(
                    map(saved => FavoritesActions.addFavoriteSuccess({ favorite: saved })),
                    catchError(err => of(FavoritesActions.addFavoriteFailure({ error: err.message })))
                )
            )
        )
    );

    removeFavorite$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FavoritesActions.removeFavorite),
            mergeMap(({ id }) =>
                this.favoriteService.removeFavorite(id).pipe(
                    map(() => FavoritesActions.removeFavoriteSuccess({ id })),
                    catchError(err => of(FavoritesActions.removeFavoriteFailure({ error: err.message })))
                )
            )
        )
    );
}
