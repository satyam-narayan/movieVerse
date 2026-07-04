import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Movie } from '@/types';

interface FavoritesState {
  items: Movie[];
}

const initialState: FavoritesState = {
  items: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<Movie>) => {
      const movie = action.payload;
      const exists = state.items.some((item) => item.id === movie.id);
      if (exists) {
        state.items = state.items.filter((item) => item.id !== movie.id);
      } else {
        state.items.push(movie);
      }
    },
  },
});

export const { toggleFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
export const selectFavorites = (state: { favorites: FavoritesState }) => state.favorites.items;
