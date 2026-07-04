import React, { memo, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ListRenderItemInfo,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { selectFavorites } from '@/store/slice/favorites.slice';
import { useAppSelector } from '@/hooks/useAppSelector';
import EmptyState from '@/components/EmptyState';
import { Movie, MainTabsNavigationProp } from '@/types';
import { movieIdKeyExtractor } from '@/utils/listUtils';
import Colors from '@/constants/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import MovieCard from '@/components/MovieCard';

export const FavoritesScreen = () => {
  const navigation = useNavigation<MainTabsNavigationProp>();
  const favorites = useAppSelector(selectFavorites);

  const handleBrowse = useCallback(() => navigation.navigate('Home'), [navigation]);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Movie>) => {
      const onPress = () =>
        navigation.navigate('MovieDetails', { movieId: item.id, title: item.title });
      return <MovieCard movie={item} onPress={onPress} />;
    },
    [navigation],
  );

  const listEmptyComponent = useCallback(
    () => (
      <EmptyState
        icon="❤️"
        title="No Favorites Yet"
        description="Tap the heart icon on any movie details page to save it to your library."
        actionLabel="Browse Movies"
        onAction={handleBrowse}
      />
    ),
    [handleBrowse],
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Favorites</Text>
        <Text style={styles.subtitle}>Your saved movies</Text>
      </View>

      <FlatList
        data={favorites}
        keyExtractor={movieIdKeyExtractor}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        ListEmptyComponent={listEmptyComponent}
      />
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
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.white,
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
    flexGrow: 1,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
});

export default FavoritesScreen;
