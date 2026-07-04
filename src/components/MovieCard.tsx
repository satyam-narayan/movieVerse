import React, { memo, useMemo, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Movie } from '@/types';
import { TMDB_IMAGE_BASE_URL } from '@/constants/config';
import Colors from '@/constants/colors';
import { formatDate } from '@/utils/formatDate';
import { getRatingColor } from '@/utils/getRatingColor';
import { AppDimensions } from '@/constants/device';

interface MovieCardProps {
  movie: Movie;
  onPress: () => void;
}

const FALLBACK_POSTER = 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=300&auto=format&fit=crop';
const cardWidth = (AppDimensions.windowWidth - 48) / 2;

const MovieCard = ({ movie, onPress }: MovieCardProps) => {
  const imageUrl = useMemo(
    () => (movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : FALLBACK_POSTER),
    [movie.poster_path],
  );

  const rating = useMemo(
    () => (movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'),
    [movie.vote_average],
  );

  const ratingColor = useMemo(
    () => (movie.vote_average ? getRatingColor(movie.vote_average) : Colors.ratingMuted),
    [movie.vote_average],
  );

  const releaseDate = useMemo(() => formatDate(movie.release_date), [movie.release_date]);

  const ratingBadgeStyle = useMemo(
    () => [styles.ratingBadge, { backgroundColor: ratingColor }],
    [ratingColor],
  );

  const imageSource = useMemo(() => ({ uri: imageUrl }), [imageUrl]);

  const handlePress = useCallback(() => {
    onPress();
  }, [onPress]);

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.85}>
      <View style={styles.imageContainer}>
        <Image source={imageSource} style={styles.image} resizeMode="cover" />
        <View style={ratingBadgeStyle}>
          <Text style={styles.ratingText}>★ {rating}</Text>
        </View>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {movie.title}
        </Text>
        <Text style={styles.year}>{releaseDate}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 6,
  },
  imageContainer: {
    height: cardWidth * 1.5,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  ratingBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  ratingText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoContainer: {
    padding: 12,
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    lineHeight: 18,
    marginBottom: 4,
  },
  year: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});

export default memo(MovieCard);
