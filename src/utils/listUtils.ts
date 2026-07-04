import { Movie } from '@/types';

export const movieKeyExtractor = (item: Movie, index: number): string =>
  `${item.id}-${index}`;

export const movieIdKeyExtractor = (item: Movie): string => item.id.toString();
