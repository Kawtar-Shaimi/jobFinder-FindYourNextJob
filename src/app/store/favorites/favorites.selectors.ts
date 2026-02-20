import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FavoritesState, selectAllFavorites } from './favorites.reducer';

export const selectFavoritesState = createFeatureSelector<FavoritesState>('favorites');

export const selectFavorites = createSelector(
    selectFavoritesState,
    selectAllFavorites
);

export const selectFavoritesLoading = createSelector(
    selectFavoritesState,
    state => state.loading
);

export const selectFavoritesError = createSelector(
    selectFavoritesState,
    state => state.error
);

export const selectIsFavorite = (offerId: string) => createSelector(
    selectFavorites,
    favorites => favorites.some(fav => fav.offerId === offerId)
);

export const selectFavoriteByOfferId = (offerId: string) => createSelector(
    selectFavorites,
    favorites => favorites.find(fav => fav.offerId === offerId)
);
