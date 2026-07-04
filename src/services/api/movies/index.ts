import apiClient from '@/services/api/index';
import Endpoints from '@/constants/endpoints';
import { Movie, MovieDetail } from '@/types';

interface TmdbResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export async function getPopularMovies(page: number = 1): Promise<Movie[]> {
  const response = await apiClient.get<TmdbResponse<Movie>>(Endpoints.movies.popular, {
    params: { page },
  });
  return response.data.results || [];
}

export async function searchMovies(query: string, page: number = 1): Promise<Movie[]> {
  const response = await apiClient.get<TmdbResponse<Movie>>(Endpoints.movies.search, {
    params: { query, page },
  });
  return response.data.results || [];
}

export async function getMovieDetails(id: number): Promise<MovieDetail> {
  const response = await apiClient.get<MovieDetail>(Endpoints.movies.details(id));
  return response.data;
}
