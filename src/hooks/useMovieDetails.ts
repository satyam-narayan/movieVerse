import { useQuery } from '@tanstack/react-query';
import { getMovieDetails } from '@/services/api/movies';
import { MovieDetail } from '@/types';
import { QUERY_KEYS } from '@/constants/query';

export const useMovieDetails = (movieId: number) =>
  useQuery<MovieDetail>({
    queryKey: [QUERY_KEYS.movieDetails, movieId],
    queryFn: () => getMovieDetails(movieId),
    enabled: !!movieId,
    retry: false,
  });

