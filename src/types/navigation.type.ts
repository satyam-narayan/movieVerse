import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  MainTabs: undefined;
  MovieDetails: { movieId: number; title: string };
};

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Favorites: undefined;
};

export type MainTabsNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;

export type MovieDetailsNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MovieDetails'>;
export type MovieDetailsRouteProp = RouteProp<RootStackParamList, 'MovieDetails'>;
