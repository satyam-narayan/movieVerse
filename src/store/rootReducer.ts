import { combineReducers } from '@reduxjs/toolkit';
import favoritesReducer from '@/store/slice/favorites.slice';

export const rootReducer = combineReducers({
  favorites: favoritesReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
