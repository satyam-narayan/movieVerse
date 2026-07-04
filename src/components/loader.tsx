import React, { memo } from 'react';
import { StyleSheet, ActivityIndicator, View, Text } from 'react-native';
import Colors from '@/constants/colors';

interface LoaderProps {
  message?: string;
}

const Loader = ({ message = 'Loading...' }: LoaderProps) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary} />
      {message ? <Text style={styles.text}>{message}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  text: {
    marginTop: 12,
    color: Colors.textSecondary,
    fontSize: 14,
  },
});

export default memo(Loader);
