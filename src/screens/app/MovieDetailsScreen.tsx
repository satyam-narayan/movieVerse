import React, { memo, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { useMovieDetails } from '@/hooks/useMovieDetails';
import Images from '@/assests/images';
import { RootStackParamList, MovieDetailsNavigationProp, MovieDetailsRouteProp } from '@/types';
import { TMDB_BACKDROP_BASE_URL, TMDB_IMAGE_BASE_URL } from '@/constants/config';
import { toggleFavorite, selectFavorites } from '@/store/slice/favorites.slice';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import Colors from '@/constants/colors';
import { formatDate } from '@/utils/formatDate';
import { AppDimensions, isIOS } from '@/constants/device';
import { SafeAreaView } from 'react-native-safe-area-context';
import Loader from '@/components/loader';
import { formatRuntime } from '@/utils/formatRuntime';



const width = AppDimensions.windowWidth;

const MovieDetailsScreen = () => {
  const route = useRoute<MovieDetailsRouteProp>();
  const navigation = useNavigation<MovieDetailsNavigationProp>();
  const dispatch = useAppDispatch();

  const { movieId } = route.params;
  const { data: movie, isLoading, isError, error, refetch } = useMovieDetails(movieId);

  const favorites = useAppSelector(selectFavorites);
  const isFavorite = useMemo(
    () => favorites.some((item) => item.id === movieId),
    [favorites, movieId],
  );

  const backdropUrl = useMemo(
    () => (movie?.backdrop_path ? `${TMDB_BACKDROP_BASE_URL}${movie.backdrop_path}` : FALLBACK_BACKDROP),
    [movie?.backdrop_path],
  );

  const posterUrl = useMemo(
    () => (movie?.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : FALLBACK_POSTER),
    [movie?.poster_path],
  );

  const formattedRuntime = useMemo(() => formatRuntime(movie?.runtime ?? null), [movie?.runtime]);

  const formattedReleaseDate = useMemo(
    () => formatDate(movie?.release_date ?? ''),
    [movie?.release_date],
  );

  const rating = useMemo(
    () => (movie?.vote_average ? movie.vote_average.toFixed(1) : 'N/A'),
    [movie?.vote_average],
  );

  const FALLBACK_BACKDROP =
    'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop';
  const FALLBACK_POSTER =
    'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=300&auto=format&fit=crop';

  const backdropSource = useMemo(() => ({ uri: backdropUrl }), [backdropUrl]);
  const posterSource = useMemo(() => ({ uri: posterUrl }), [posterUrl]);

  const handleGoBack = useCallback(() => navigation.goBack(), [navigation]);

  const handleFavoriteToggle = useCallback(() => {
    if (!movie) return;
    const movieToSave = {
      id: movie.id,
      title: movie.title,
      original_title: movie.original_title,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
      vote_count: movie.vote_count,
      overview: movie.overview,
      genre_ids: movie.genres.map((g) => g.id),
    };
    dispatch(toggleFavorite(movieToSave));
  }, [dispatch, movie]);

  const handleRetry = useCallback(() => refetch(), [refetch]);

  if (isLoading) {
    return <Loader message="Loading movie details..." />;
  }

  if (isError || !movie) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Error: {error?.message ?? 'Failed to load details'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />


      <SafeAreaView style={styles.headerActions}>
        <TouchableOpacity style={styles.circleButton} onPress={handleGoBack} activeOpacity={0.8}>
          <Image source={Images.back} style={styles.backImage} resizeMode="contain" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.circleButton}
          onPress={handleFavoriteToggle}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonIcon}>{isFavorite ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>

        <View style={styles.backdropContainer}>
          <Image source={backdropSource} style={styles.backdrop} resizeMode="cover" />
          <View style={styles.backdropOverlay} />
        </View>


        <View style={styles.detailsContainer}>
          <View style={styles.mainInfo}>

            <Image source={posterSource} style={styles.poster} resizeMode="cover" />

            <View style={styles.titleInfo}>
              <Text style={styles.title}>{movie.title}</Text>
              {movie.tagline ? <Text style={styles.tagline}>"{movie.tagline}"</Text> : null}

              <View style={styles.metaRow}>
                <View style={styles.metaBadge}>
                  <Text style={styles.metaBadgeText}>★ {rating}</Text>
                </View>
                <Text style={styles.metaText}>{formattedRuntime}</Text>
              </View>

              <Text style={styles.metaText}>Release: {formattedReleaseDate}</Text>
            </View>
          </View>


          {movie.genres && movie.genres.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Genres</Text>
              <View style={styles.genreList}>
                {movie.genres.map((genre) => (
                  <View key={genre.id} style={styles.genrePill}>
                    <Text style={styles.genreText}>{genre.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}


          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <Text style={styles.overviewText}>{movie.overview || 'No overview available.'}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerActions: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: isIOS ? 0 : 20,
  },
  circleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.overlayHeader,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  buttonIcon: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  backImage: {
    width: 32,
    height: 32,
    tintColor: Colors.white,
  },
  scrollContent: {
    flexGrow: 1,
  },
  backdropContainer: {
    width: width,
    height: width * 0.65,
    position: 'relative',
  },
  backdrop: {
    width: '100%',
    height: '100%',
  },
  backdropOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: Colors.overlayDark,
  },
  detailsContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -32,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  mainInfo: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  poster: {
    width: 110,
    height: 165,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.cardBackground,
    marginTop: -60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  titleInfo: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.textPrimary,
    lineHeight: 28,
  },
  tagline: {
    fontSize: 13,
    fontStyle: 'italic',
    color: Colors.textSecondary,
    marginTop: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 6,
  },
  metaBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 10,
  },
  metaBadgeText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  metaText: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  genreList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  genrePill: {
    backgroundColor: Colors.cardBackground,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    margin: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  genreText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  overviewText: {
    color: Colors.textSecondary,
    fontSize: 15,
    lineHeight: 24,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 24,
  },
  errorText: {
    color: Colors.ratingRed,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
});

export default MovieDetailsScreen;
