import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

import { RotatePhone } from '@/components/RotatePhone';
import { PaceDistanceGraph } from '@/components/Trends/Graphs/PaceDistanceGraph';
import { colors } from '@/config/colors';
import { useSettings } from '@/context/SettingsContext';
import { useWorkoutData } from '@/hooks/useWorkoutData';

export default function PaceByDistanceScreen() {
  const router = useRouter();
  const { distanceUnit, timeRangeInDays, activityType } = useSettings();
  const [screenData, setScreenData] = useState(Dimensions.get('window'));

  useEffect(() => {
    const onChange = (result: { window: typeof screenData }) => {
      setScreenData(result.window);
    };

    const subscription = Dimensions.addEventListener('change', onChange);
    return () => subscription?.remove();
  }, []);

  const { width: screenWidth, height: screenHeight } = screenData;
  const isLandscape = screenWidth > screenHeight;

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
      <View style={[styles.header, !isLandscape && { paddingTop: 60 }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color="#fff"
          />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Pace by Distance</Text>
        </View>
      </View>

      {!isLandscape && <RotatePhone />}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            animating
            color="#fff"
            size="large"
          />
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
    marginLeft: -50,
  },
  header: {
    backgroundColor: colors.surface,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    zIndex: 11,
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
