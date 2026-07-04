import { useInfiniteQuery } from '@tanstack/react-query';
import { getPopularMovies } from '@/services/api/movies';
import { Movie } from '@/types';
import { QUERY_KEYS } from '@/constants/query';

export const useInfinitePopularMovies = () =>
  useInfiniteQuery<Movie[], Error>({
    queryKey: [QUERY_KEYS.popularMoviesInfinite],
    queryFn: ({ pageParam = 1 }) => getPopularMovies(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === 0 ? undefined : allPages.length + 1,
    retry: false,
  });

