import React, { memo, useState, useMemo, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ListRenderItemInfo,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useInfiniteSearchMovies } from '@/hooks/useInfiniteSearchMovies';
import { Movie, MainTabsNavigationProp } from '@/types';
import { movieKeyExtractor } from '@/utils/listUtils';
import Colors from '@/constants/colors';
import EmptyState from '@/components/EmptyState';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDebounce } from '@/hooks/useDebounce';
import MovieCard from '@/components/MovieCard';

const SearchScreen = () => {
  const navigation = useNavigation<MainTabsNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 500);

  const {
    data: moviesData,
    isLoading,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteSearchMovies(debouncedQuery);

  const movies = useMemo(() => moviesData?.pages.flat() ?? [], [moviesData]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleClear = useCallback(() => {
    setSearchQuery('');
  }, []);

  const handleRetry = useCallback(() => refetch(), [refetch]);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Movie>) => {
      const onPress = () =>
        navigation.navigate('MovieDetails', { movieId: item.id, title: item.title });
      return <MovieCard movie={item} onPress={onPress} />;
    },
    [navigation],
  );

  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={Colors.primary} />
      </View>
    );
  }, [isFetchingNextPage]);

  const noResultsComponent = useCallback(
    () => (
      <EmptyState
        icon="🔍"
        title="No Results"
        description={`No movies found for "${debouncedQuery}".`}
      />
    ),
    [debouncedQuery],
  );

  const renderContent = useCallback(() => {
    if (isLoading && !isFetchingNextPage) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Searching movies...</Text>
        </View>
      );
    }

    if (isError) {
      return (
        <View style={styles.center}>
          <Text style={styles.errorText}>Error: {error?.message ?? 'Something went wrong'}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!debouncedQuery.trim()) {
      return (
        <EmptyState
          icon="🍿"
          title="Search Movies"
          description="Type keywords to find your favourite movies."
        />
      );
    }

    return (
      <FlatList
        data={movies}
        keyExtractor={movieKeyExtractor}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.05}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={noResultsComponent}
      />
    );
  }, [
    isLoading,
    isFetchingNextPage,
    isError,
    error,
    debouncedQuery,
    movies,
    renderItem,
    renderFooter,
    noResultsComponent,
    handleRetry,
    handleLoadMore,
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchHeader}>
        <Text style={styles.title}>Search</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Search by movie title..."
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.content}>{renderContent()}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchHeader: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.white,
    marginBottom: 12,
  },
  inputContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    paddingLeft: 16,
    paddingRight: 40,
    color: Colors.textPrimary,
    fontSize: 15,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  clearButton: {
    position: 'absolute',
    right: 12,
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  clearButtonText: {
    color: Colors.textSecondary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
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
    padding: 24,
  },
  loadingText: {
    color: Colors.textSecondary,
    marginTop: 12,
    fontSize: 14,
  },
  errorText: {
    color: Colors.ratingRed,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: Colors.cardBackground,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: Colors.textPrimary,
    fontWeight: 'bold',
  },
  footerLoader: {
    alignItems: 'center',
  },
});

export default SearchScreen;
