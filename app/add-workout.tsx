import { Ionicons } from '@expo/vector-icons';
import { WorkoutActivityType, saveWorkoutSample } from '@kingstinct/react-native-healthkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text, TextInput, TouchableRipple } from 'react-native-paper';

import { AuthorizationOverlay } from '@/components/AuthorizationOverlay';
import { DateTimeModal } from '@/components/DateTimeModal/DateTimeModal';
import { DurationModal } from '@/components/DurationModal/DurationModal';
import { colors } from '@/config/colors';
import { LatoFonts, OrelegaOneFonts } from '@/config/fonts';
import { useSettings } from '@/context/SettingsContext';
import { useWorkoutAuthorization } from '@/hooks/useWorkoutAuthorization';
import { subheading } from '@/utils/text';

function convertDurationToMinutes(durationString: string): number {
  if (!durationString) return 0;

  const parts = durationString.split(':');
  if (parts.length !== 2) return 0;

  const minutes = parseInt(parts[0], 10) || 0;
  const seconds = parseInt(parts[1], 10) || 0;

  return minutes + seconds / 60;
}

const getActivityTypeLabel = (type: WorkoutActivityType) => {
  const activityTypeOptions = [
    { value: WorkoutActivityType.running, label: 'Running' },
    { value: WorkoutActivityType.cycling, label: 'Cycling' },
    { value: WorkoutActivityType.walking, label: 'Walking' },
  ];
  return activityTypeOptions.find((option) => option.value === type)?.label || 'Other';
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString();
};

const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export default function AddWorkoutScreen() {
  const { activityType, distanceUnit } = useSettings();
  const { authorizationStatus, requestAuthorization } = useWorkoutAuthorization();

  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDurationPicker, setShowDurationPicker] = useState(false);

  const resetForm = () => {
    setDistance('');
    setDuration('');
    setStartDate(new Date());
    setShowDatePicker(false);
    setShowTimePicker(false);
    setShowDurationPicker(false);
  };

  const handleSaveWorkout = async () => {
    const distanceValue = parseFloat(distance);
    const durationValue = convertDurationToMinutes(duration);

    if (!distanceValue || distanceValue <= 0) {
      Alert.alert('Invalid Distance', 'Please enter a valid distance greater than 0.');
      return;
    }

    if (!durationValue || durationValue <= 0) {
      Alert.alert('Invalid Duration', 'Please enter a valid duration greater than 0.');
      return;
    }

    setIsLoading(true);

    try {
      // Calculate end date based on duration (in minutes)
      const endDate = new Date(startDate.getTime() + durationValue * 60 * 1000);

      // Convert distance to meters if needed
      const distanceInMeters =
        distanceUnit === 'mi' ? distanceValue * 1609.34 : distanceValue * 1000;

      await saveWorkoutSample(
        activityType,
        [], // No quantity samples
        startDate,
        endDate,
        {
          distance: distanceInMeters,
          energyBurned: undefined,
        },
        {}, // No metadata
      );

      // Set flag to refresh workout data when returning to main screen
      await AsyncStorage.setItem('workoutDataNeedsRefresh', 'true');

      Alert.alert('Success', 'Workout saved successfully!', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
      resetForm();
    } catch (error) {
      console.error('Error saving workout:', error);
      Alert.alert(
        'Error',
        'Failed to save workout. Please ensure you have granted HealthKit permissions.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (_event: any, selectedDate?: Date) => {
    if (selectedDate) {
      // Preserve the time part when changing date
      const newDate = new Date(startDate);
      newDate.setFullYear(selectedDate.getFullYear());
      newDate.setMonth(selectedDate.getMonth());
      newDate.setDate(selectedDate.getDate());
      setStartDate(newDate);
    }
  };

  const handleTimeChange = (_event: any, selectedTime?: Date) => {
    if (selectedTime) {
      // Preserve the date part when changing time
      const newDate = new Date(startDate);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setStartDate(newDate);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Add Workout',
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.neutral,
          headerTitleStyle: {
            fontFamily: LatoFonts.bold,
          },
          headerLeft: () => (
            <TouchableRipple
              style={styles.headerButton}
              onPress={() => router.back()}
              borderless
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color={colors.neutral}
              />
            </TouchableRipple>
          ),
        }}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Add Workout</Text>

          <Text style={styles.label}>Activity Type</Text>
          <TouchableRipple
            style={styles.dateTimeButton}
            onPress={() => router.push('/(tabs)/settings')}
          >
            <View style={styles.dateTimeButtonContent}>
              <Text style={styles.disabledText}>{getActivityTypeLabel(activityType)}</Text>
              <Ionicons
                name="settings-outline"
                size={20}
                color={colors.gray}
              />
            </View>
          </TouchableRipple>
          <Text style={{ marginBottom: 16, color: colors.lightGray }}>
            This is linked to the activity type set in settings. Tap to change.
          </Text>

          {/* First Row: Date and Time */}
          <View style={styles.gridRow}>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Date</Text>
              <TouchableRipple
                style={styles.gridButton}
                onPress={() => setShowDatePicker(true)}
              >
                <View style={styles.dateTimeButtonContent}>
                  <Text style={styles.dateTimeButtonText}>{formatDate(startDate)}</Text>
                  <Ionicons
                    name="calendar-outline"
                    size={20}
                    color={colors.gray}
                  />
                </View>
              </TouchableRipple>
            </View>

            <View style={styles.gridItem}>
              <Text style={styles.label}>Time</Text>
              <TouchableRipple
                style={styles.gridButton}
                onPress={() => setShowTimePicker(true)}
              >
                <View style={styles.dateTimeButtonContent}>
                  <Text style={styles.dateTimeButtonText}>{formatTime(startDate)}</Text>
                  <Ionicons
                    name="time-outline"
                    size={20}
                    color={colors.gray}
                  />
                </View>
              </TouchableRipple>
            </View>
          </View>

          {/* Second Row: Duration and Distance */}
          <View style={styles.gridRow}>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Duration</Text>
              <TouchableRipple
                style={styles.gridButton}
                onPress={() => setShowDurationPicker(true)}
              >
                <View style={styles.dateTimeButtonContent}>
                  <Text style={styles.dateTimeButtonText}>
                    {duration || 'Select duration (MM:SS)'}
                  </Text>
                  <Ionicons
                    name="time-outline"
                    size={20}
                    color={colors.gray}
                  />
                </View>
              </TouchableRipple>
            </View>

            <View style={styles.gridItem}>
              <Text style={styles.label}>Distance ({distanceUnit})</Text>
              <TextInput
                mode="outlined"
                value={distance}
                onChangeText={setDistance}
                placeholder={`Enter distance in ${distanceUnit === 'mi' ? 'miles' : 'kilometers'}`}
                keyboardType="decimal-pad"
                style={styles.gridInput}
                placeholderTextColor={colors.gray}
                outlineStyle={{ borderColor: '#161616' }}
                right={
                  <TextInput.Icon
                    icon="map-marker-distance"
                    color={colors.gray}
                  />
                }
              />
            </View>
          </View>
        </View>

        {/* Date Picker */}
        <DateTimeModal
          visible={showDatePicker}
          onClose={() => setShowDatePicker(false)}
          value={startDate}
          mode="date"
          onChange={handleDateChange}
          title="Select Date"
        />

        {/* Time Picker */}
        <DateTimeModal
          visible={showTimePicker}
          onClose={() => setShowTimePicker(false)}
          value={startDate}
          mode="time"
          onChange={handleTimeChange}
          title="Select Time"
        />

        {/* Duration Picker */}
        <DurationModal
          visible={showDurationPicker}
          onClose={() => setShowDurationPicker(false)}
          value={duration}
          onChange={setDuration}
          title="Select Duration"
        />

        <View style={styles.buttonContainer}>
          <Button
            mode="outlined"
            onPress={() => router.back()}
            style={[
              styles.button,
              { backgroundColor: colors.surface, borderColor: colors.surfaceHighlight },
            ]}
            disabled={isLoading}
            labelStyle={{ color: colors.neutral }}
          >
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={handleSaveWorkout}
            style={styles.button}
            loading={isLoading}
            disabled={isLoading}
            labelStyle={{ color: colors.neutral }}
          >
            Save
          </Button>
        </View>
      </ScrollView>

      <AuthorizationOverlay
        authorizationStatus={authorizationStatus}
        requestAuthorization={requestAuthorization}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    flexGrow: 1,
    padding: 20,
  },
  headerButton: {
    padding: 8,
    borderRadius: 20,
  },
  form: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 42,
    fontFamily: OrelegaOneFonts.regular,
    color: colors.neutral,
    marginTop: 10,
    marginBottom: 10,
  },
  label: {
    ...subheading,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  gridItem: {
    flex: 1,
  },
  gridButton: {
    borderWidth: 1,
    borderColor: '#161616',
    borderRadius: 4,
    padding: 16,
    marginBottom: 8,
    backgroundColor: colors.surface,
  },
  gridInput: {
    marginBottom: 8,
    backgroundColor: colors.surface,
    borderColor: '#161616',
    borderWidth: 1,
    borderRadius: 4,
  },
  disabledText: {
    color: colors.gray,
  },
  dateTimeButton: {
    borderWidth: 1,
    borderColor: '#161616',
    borderRadius: 4,
    padding: 16,
    marginBottom: 8,
    backgroundColor: colors.surface,
  },
  dateTimeButtonContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateTimeButtonText: {
    fontSize: 16,
    color: colors.neutral,
    fontFamily: LatoFonts.regular,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginTop: 32,
  },
  button: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 12,
  },
});
