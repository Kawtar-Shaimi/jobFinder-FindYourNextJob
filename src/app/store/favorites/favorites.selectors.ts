import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FavoritesState, adapter, selectAllFavorites } from './favorites.reducer';

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

/** Count of favorites in store */
export const selectFavoritesCount = createSelector(
    selectFavoritesState,
    state => adapter.getSelectors().selectTotal(state)
);

/** Check if a job offer is in favorites by offerId */
export const selectIsFavorite = (offerId: string) => createSelector(
    selectFavorites,
    favorites => favorites.some(fav => fav.offerId === offerId)
);

/** Get a favorite by its offerId (returns undefined if not found) */
export const selectFavoriteByOfferId = (offerId: string) => createSelector(
    selectFavorites,
    favorites => favorites.find(fav => fav.offerId === offerId)
);
