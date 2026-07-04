import { useInfiniteQuery } from '@tanstack/react-query';
import { searchMovies } from '@/services/api/movies';
import { Movie } from '@/types';
import { QUERY_KEYS } from '@/constants/query';

export const useInfiniteSearchMovies = (query: string) =>
  useInfiniteQuery<Movie[], Error>({
    queryKey: [QUERY_KEYS.searchMoviesInfinite, query],
    queryFn: ({ pageParam = 1 }) => searchMovies(query, pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === 0 ? undefined : allPages.length + 1,
    enabled: query.trim().length > 0,
    retry: false,
  });

