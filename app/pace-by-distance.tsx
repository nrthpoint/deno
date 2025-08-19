import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

import { PaceDistanceGraph } from '@/components/Trends/PaceDistanceGraph';
import { colors } from '@/config/colors';
import { useSettings } from '@/context/SettingsContext';
import { useWorkoutData } from '@/hooks/useWorkoutData';

export default function PaceByDistanceScreen() {
  const router = useRouter();
  const { distanceUnit, timeRangeInDays, activityType } = useSettings();

  const { workouts, loading, authorizationStatus } = useWorkoutData({
    activityType,
    distanceUnit,
    timeRangeInDays,
  });

  // Enable landscape orientation when screen mounts
  useEffect(() => {
    const enableLandscape = async () => {
      await ScreenOrientation.unlockAsync();
    };

    enableLandscape();

    // Return to portrait when screen unmounts
    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Pace by Distance</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator animating color="#fff" size="large" />
          <Text style={styles.loadingText}>Loading workout data...</Text>
        </View>
      ) : authorizationStatus !== 2 ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Health data access required</Text>
        </View>
      ) : (
        <ScrollView style={styles.content}>
          <PaceDistanceGraph workouts={workouts} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  header: {
    backgroundColor: colors.surface,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    zIndex: 1,
    display: 'flex',
    flexDirection: 'row',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 5,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
  subtitle: {
    color: '#bbb',
    fontSize: 18,
  },
});
