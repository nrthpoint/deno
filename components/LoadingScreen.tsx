import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';

import { colors } from '@/config/colors';
import { subheading } from '@/utils/text';

export const LoadingScreen = ({ message = 'Loading...' }: { message?: string }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  return (
    <View style={styles.loadingScreen}>
      <Animated.View
        style={[
          styles.loadingContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <ActivityIndicator
          animating
          color={colors.primary}
          size="large"
          style={styles.spinner}
        />
        <Text style={styles.loadingText}>{message}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    zIndex: 1000,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 30,
  },
  spinner: {
    marginBottom: 20,
  },
  loadingText: {
    ...subheading,
    color: colors.neutral,
    textAlign: 'center',
  },
});
