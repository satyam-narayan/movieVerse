import React from 'react';
import { StyleSheet, View, Image, ImageSourcePropType, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '@/screens/tab/HomeScreen';
import SearchScreen from '@/screens/tab/SearchScreen';
import FavoritesScreen from '@/screens/tab/FavoritesScreen';
import { MainTabParamList } from '@/types';
import Colors from '@/constants/colors';
import Images from '@/assests/images';

const Tab = createBottomTabNavigator<MainTabParamList>();

const TabIcon = ({ source, focused }: { source: ImageSourcePropType; focused: boolean }) => (
  <View style={[styles.tabIconContainer, focused && styles.tabIconContainerActive]}>
    <Image
      source={source}
      style={[
        styles.tabIconImage,
        focused ? styles.tabIconImageActive : styles.tabIconImageInactive,
      ]}
      resizeMode="contain"
    />
  </View>
);

const HomeTabIcon = ({ focused }: { focused: boolean }) => (
  <TabIcon source={focused ? Images.homeFilled : Images.home} focused={focused} />
);

const SearchTabIcon = ({ focused }: { focused: boolean }) => (
  <TabIcon source={focused ? Images.searchFilled : Images.search} focused={focused} />
);

const FavoritesTabIcon = ({ focused }: { focused: boolean }) => (
  <TabIcon source={focused ? Images.favoriteFilled : Images.favorite} focused={focused} />
);

const TabBarButton = (props: any) => (
  <TouchableOpacity
    {...props}
    activeOpacity={1}
  />
);

export const AppTabNavigator = () => {
  const insets = useSafeAreaInsets();
  const tabBarHeight = 65 + insets.bottom;
  const tabBarPaddingBottom = insets.bottom;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          backgroundColor: Colors.cardBackground,
          borderTopWidth: 1,
          borderTopColor: Colors.border,
          height: tabBarHeight,
          paddingBottom: tabBarPaddingBottom,
          paddingTop: 8,
          marginTop: -15
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          letterSpacing: 0.3,
          marginTop: 5,
        },
        tabBarAllowFontScaling: false,
        tabBarButton: TabBarButton,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: 'Browse', tabBarIcon: HomeTabIcon }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{ tabBarLabel: 'Search', tabBarIcon: SearchTabIcon }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{ tabBarLabel: 'Favorites', tabBarIcon: FavoritesTabIcon }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 56,
    height: 36,
    borderRadius: 10,
  },
  tabIconContainerActive: {
    backgroundColor: Colors.primaryAlpha10,
  },
  tabIconImage: {
    width: 32,
    height: 32,
  },
  tabIconImageActive: {
    tintColor: Colors.primary,
  },
  tabIconImageInactive: {
    tintColor: Colors.textMuted,
  },
});

export default AppTabNavigator;
