import React, { memo, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  ListRenderItemInfo,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useInfinitePopularMovies } from '@/hooks/useInfinitePopularMovies';
import { Movie, MainTabsNavigationProp } from '@/types';
import { movieKeyExtractor } from '@/utils/listUtils';
import Colors from '@/constants/colors';
import EmptyState from '@/components/EmptyState';
import { SafeAreaView } from 'react-native-safe-area-context';
import MovieCard from '@/components/MovieCard';
import Loader from '@/components/loader';

const HomeScreen = () => {
  const navigation = useNavigation<MainTabsNavigationProp>();

  const {
    data: popularData,
    isLoading: isLoadingPopular,
    isError: isErrorPopular,
    error: errorPopular,
    refetch: refetchPopular,
    isRefetching: isRefetchingPopular,
    fetchNextPage: fetchPopularNextPage,
    hasNextPage: popularHasNextPage,
    isFetchingNextPage: isFetchingPopularNext,
  } = useInfinitePopularMovies();

  const movies = useMemo(() => popularData?.pages.flat() ?? [], [popularData]);

  const handleRefetch = useCallback(() => { refetchPopular(); }, [refetchPopular]);

  const handleLoadMore = useCallback(() => {
    if (popularHasNextPage && !isFetchingPopularNext) {
      fetchPopularNextPage();
    }
  }, [popularHasNextPage, isFetchingPopularNext, fetchPopularNextPage]);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Movie>) => {
      const onPress = () =>
        navigation.navigate('MovieDetails', { movieId: item.id, title: item.title });
      return <MovieCard movie={item} onPress={onPress} />;
    },
    [navigation],
  );

  const renderFooter = useCallback(() => {
    if (!isFetchingPopularNext) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={Colors.primary} />
      </View>
    );
  }, [isFetchingPopularNext]);

  const listEmptyComponent = useCallback(
    () => (
      <EmptyState
        icon="🎬"
        title="No Movies Found"
        description="Popular movies could not be loaded. Please try again."
      />
    ),
    [],
  );


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>
          Movie<Text style={styles.logoAccent}>Verse</Text>
        </Text>
        <Text style={styles.subtitle}>Discover Popular Movies</Text>
      </View>

      {isErrorPopular ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>
            Error: {errorPopular?.message ?? 'Something went wrong'}
          </Text>
          <Text style={styles.retryText} onPress={handleRefetch}>
            Tap to Retry
          </Text>
        </View>
      ) : (
        isLoadingPopular && !isRefetchingPopular ? <Loader message="Loading popular movies..." /> :
          <FlatList
            data={movies}
            keyExtractor={movieKeyExtractor}
            renderItem={renderItem}
            numColumns={2}
            contentContainerStyle={styles.listContent}
            columnWrapperStyle={styles.columnWrapper}
            onRefresh={handleRefetch}
            refreshing={isRefetchingPopular}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.05}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={listEmptyComponent}
          />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  logo: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.white,
    letterSpacing: 0.5,
  },
  logoAccent: {
    color: Colors.primary,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  columnWrapper: {
    justifyContent: 'space-between',
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
    fontWeight: '600',
  },
  retryText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  footerLoader: {
    alignItems: 'center',
  },
});

export default HomeScreen;
