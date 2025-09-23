import React from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

import { Card } from '@/components/Card/Card';
import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
import { clearPreviousAchievements } from '@/services/achievements';
import { debugAchievements, forceBackgroundCheck } from '@/services/background-service';
import { getBackgroundTaskStatus, unregisterBackgroundTask } from '@/services/notifications';

export const DeveloperSettings: React.FC = () => {
  const handleDebugAchievements = async () => {
    try {
      console.log('Starting achievement debug...');
      await debugAchievements();
      Alert.alert('Debug Complete', 'Check console logs for achievement debug information');
    } catch (error) {
      console.error('Debug error:', error);
      Alert.alert('Debug Error', 'Failed to run achievement debug. Check console for details.');
    }
  };

  const handleForceBackgroundCheck = async () => {
    try {
      console.log('Forcing background check...');
      await forceBackgroundCheck();
      Alert.alert(
        'Background Check',
        'Background achievement check completed. Check console for details.',
      );
    } catch (error) {
      console.error('Background check error:', error);
      Alert.alert(
        'Background Check Error',
        'Failed to run background check. Check console for details.',
      );
    }
  };

  const handleCheckBackgroundTaskStatus = async () => {
    try {
      const status = await getBackgroundTaskStatus();
      const message = `Task Defined: ${status.isTaskDefined}\nTask Registered: ${status.isTaskRegistered}\nBackground Task: ${status.backgroundTaskStatus}`;

      Alert.alert('Background Task Status', message);
      console.log('Background task status:', status);
    } catch (error) {
      console.error('Status check error:', error);
      Alert.alert('Status Error', 'Failed to check background task status.');
    }
  };

  const handleUnregisterBackgroundTask = async () => {
    try {
      await unregisterBackgroundTask();
      Alert.alert('Success', 'Background task unregistered successfully');
    } catch (error) {
      console.error('Unregister error:', error);
      Alert.alert('Error', 'Failed to unregister background task.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card>
        <View style={styles.cardContent}>
          <Text
            variant="titleLarge"
            style={[styles.heading, { marginTop: 0 }]}
          >
            Background Achievement Debug
          </Text>
          <Text style={styles.subheading}>Debug and test background achievement detection.</Text>

          <View style={styles.buttonContainer}>
            <Button
              mode="outlined"
              onPress={clearPreviousAchievements}
              style={styles.clearButton}
              labelStyle={styles.buttonText}
            >
              Clear Achievement History
            </Button>
            <Text style={styles.buttonDescription}>
              Removes all stored achievement data from AsyncStorage. Use this to reset achievement
              tracking for testing new personal bests.
            </Text>

            <Button
              mode="contained"
              onPress={handleDebugAchievements}
              style={styles.debugButton}
              labelStyle={styles.buttonText}
            >
              Debug Achievement Detection
            </Button>
            <Text style={styles.buttonDescription}>
              Runs achievement detection on all workouts and logs detailed information to console.
              Shows which achievements would be triggered.
            </Text>

            <Button
              mode="outlined"
              onPress={handleForceBackgroundCheck}
              style={styles.forceButton}
              labelStyle={styles.buttonText}
            >
              Force Background Check
            </Button>
            <Text style={styles.buttonDescription}>
              Manually triggers the background achievement check process. Useful for testing
              background task functionality without waiting.
            </Text>

            <Button
              mode="outlined"
              onPress={handleCheckBackgroundTaskStatus}
              style={styles.statusButton}
              labelStyle={styles.buttonText}
            >
              Check Background Task Status
            </Button>
            <Text style={styles.buttonDescription}>
              Displays the current status of background task registration and whether the task is
              properly defined and active.
            </Text>

            <Button
              mode="outlined"
              onPress={handleUnregisterBackgroundTask}
              style={styles.statusButton}
              labelStyle={styles.buttonText}
            >
              Unregister Background Task
            </Button>
            <Text style={styles.buttonDescription}>
              Removes the background task registration from the system. Use this to stop background
              achievement processing.
            </Text>
          </View>
        </View>
      </Card>
    </ScrollView>
  );
};

export const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexGrow: 1,
  },
  heading: {
    fontSize: 18,
    fontFamily: LatoFonts.bold,
    color: colors.neutral,
  },
  subheading: {
    fontSize: 16,
    fontFamily: LatoFonts.regular,
    color: colors.neutral,
    marginTop: 10,
    lineHeight: 22,
  },
  cardContent: {
    margin: 16,
  },
  buttonContainer: {
    marginTop: 16,
    gap: 12,
  },
  clearButton: {
    borderColor: colors.gray,
    borderRadius: 8,
  },
  debugButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  forceButton: {
    borderColor: colors.gray,
    borderRadius: 8,
  },
  statusButton: {
    borderColor: colors.gray,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 14,
    fontFamily: LatoFonts.bold,
    color: colors.neutral,
  },
  buttonDescription: {
    fontSize: 12,
    fontFamily: LatoFonts.regular,
    color: colors.lightGray,
    marginTop: 4,
    marginBottom: 15,
    lineHeight: 16,
  },
});
