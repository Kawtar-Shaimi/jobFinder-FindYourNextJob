import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { FavoriteOffer } from '../../core/models/favorite.model';
import * as FavoritesActions from './favorites.actions';

export interface FavoritesState extends EntityState<FavoriteOffer> {
    loading: boolean;
    error: string | null;
}

export const adapter: EntityAdapter<FavoriteOffer> = createEntityAdapter<FavoriteOffer>({
    selectId: (fav) => fav.id!
});

export const initialState: FavoritesState = adapter.getInitialState({
    loading: false,
    error: null
});

export const favoritesReducer = createReducer(
    initialState,

    // Load
    on(FavoritesActions.loadFavorites, state => ({ ...state, loading: true, error: null })),
    on(FavoritesActions.loadFavoritesSuccess, (state, { favorites }) =>
        adapter.setAll(favorites, { ...state, loading: false })
    ),
    on(FavoritesActions.loadFavoritesFailure, (state, { error }) =>
        ({ ...state, loading: false, error })
    ),

    // Add
    on(FavoritesActions.addFavorite, state => ({ ...state, loading: true })),
    on(FavoritesActions.addFavoriteSuccess, (state, { favorite }) =>
        adapter.addOne(favorite, { ...state, loading: false })
    ),
    on(FavoritesActions.addFavoriteFailure, (state, { error }) =>
        ({ ...state, loading: false, error })
    ),

    // Remove
    on(FavoritesActions.removeFavorite, state => ({ ...state, loading: true })),
    on(FavoritesActions.removeFavoriteSuccess, (state, { id }) =>
        adapter.removeOne(id, { ...state, loading: false })
    ),
    on(FavoritesActions.removeFavoriteFailure, (state, { error }) =>
        ({ ...state, loading: false, error })
    )
);

export const {
    selectAll: selectAllFavorites,
    selectEntities: selectFavoriteEntities,
    selectIds: selectFavoriteIds,
    selectTotal: selectFavoritesTotal
} = adapter.getSelectors();
