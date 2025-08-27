import { Ionicons } from '@expo/vector-icons';
import {
  WorkoutActivityType,
  AuthorizationRequestStatus,
} from '@kingstinct/react-native-healthkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Stack, router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View, Alert, ScrollView, Platform } from 'react-native';
import { Button, TextInput, Text, TouchableRipple } from 'react-native-paper';

import { AuthorizationOverlay } from '@/components/AuthorizationOverlay';
import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
import { useSettings } from '@/context/SettingsContext';
import { useWorkoutAuthorization } from '@/hooks/useWorkoutAuthorization';

export default function AddWorkoutScreen() {
  const { activityType, distanceUnit } = useSettings();
  const { authorizationStatus, requestAuthorization } = useWorkoutAuthorization();

  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const resetForm = () => {
    setDistance('');
    setDuration('');
    setStartDate(new Date());
    setShowDatePicker(false);
    setShowTimePicker(false);
  };

  const handleSaveWorkout = async () => {
    // Check authorization first
    if (authorizationStatus !== AuthorizationRequestStatus.unnecessary) {
      Alert.alert(
        'Authorization Required',
        'Please grant HealthKit permissions to save workouts.',
        [
          {
            text: 'Grant Permission',
            onPress: () => requestAuthorization(),
          },
          { text: 'Cancel', style: 'cancel' },
        ],
      );
      return;
    }

    // Validate inputs
    const distanceValue = parseFloat(distance);
    const durationValue = parseFloat(duration);

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
      const { saveWorkoutSample } = await import('@kingstinct/react-native-healthkit');

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
          energyBurned: undefined, // Let HealthKit calculate if desired
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

  const getActivityTypeLabel = (type: WorkoutActivityType) => {
    const activityTypeOptions = [
      { value: WorkoutActivityType.running, label: 'Running' },
      { value: WorkoutActivityType.cycling, label: 'Cycling' },
      { value: WorkoutActivityType.walking, label: 'Walking' },
      { value: WorkoutActivityType.swimming, label: 'Swimming' },
      { value: WorkoutActivityType.hiking, label: 'Hiking' },
      { value: WorkoutActivityType.yoga, label: 'Yoga' },
      { value: WorkoutActivityType.functionalStrengthTraining, label: 'Strength' },
      { value: WorkoutActivityType.other, label: 'Other' },
    ];
    return activityTypeOptions.find((option) => option.value === type)?.label || 'Other';
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      // Preserve the time part when changing date
      const newDate = new Date(startDate);
      newDate.setFullYear(selectedDate.getFullYear());
      newDate.setMonth(selectedDate.getMonth());
      newDate.setDate(selectedDate.getDate());
      setStartDate(newDate);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      // Preserve the date part when changing time
      const newDate = new Date(startDate);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setStartDate(newDate);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
          <Text style={styles.sectionTitle}>Workout Details</Text>

          <Text style={styles.label}>Activity Type</Text>
          <TextInput
            mode="outlined"
            value={getActivityTypeLabel(activityType)}
            editable={false}
            style={[styles.input, styles.disabledInput]}
            right={<TextInput.Icon icon="settings" />}
          />

          <Text style={styles.label}>Date</Text>
          <TouchableRipple
            style={styles.dateTimeButton}
            onPress={() => setShowDatePicker(true)}
          >
            <View style={styles.dateTimeButtonContent}>
              <Text style={styles.dateTimeButtonText}>{formatDate(startDate)}</Text>
              <Ionicons
                name="calendar-outline"
                size={20}
                color={colors.neutral}
              />
            </View>
          </TouchableRipple>

          <Text style={styles.label}>Time</Text>
          <TouchableRipple
            style={styles.dateTimeButton}
            onPress={() => setShowTimePicker(true)}
          >
            <View style={styles.dateTimeButtonContent}>
              <Text style={styles.dateTimeButtonText}>{formatTime(startDate)}</Text>
              <Ionicons
                name="time-outline"
                size={20}
                color={colors.neutral}
              />
            </View>
          </TouchableRipple>

          <Text style={styles.label}>Distance ({distanceUnit})</Text>
          <TextInput
            mode="outlined"
            value={distance}
            onChangeText={setDistance}
            placeholder={`Enter distance in ${distanceUnit === 'mi' ? 'miles' : 'kilometers'}`}
            keyboardType="decimal-pad"
            style={styles.input}
            right={<TextInput.Affix text={distanceUnit} />}
          />

          <Text style={styles.label}>Duration (minutes)</Text>
          <TextInput
            mode="outlined"
            value={duration}
            onChangeText={setDuration}
            placeholder="Enter duration in minutes"
            keyboardType="decimal-pad"
            style={styles.input}
            right={<TextInput.Affix text="min" />}
          />
        </View>

        {/* Date Picker */}
        {showDatePicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
          />
        )}

        {/* Time Picker */}
        {showTimePicker && (
          <DateTimePicker
            value={startDate}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleTimeChange}
          />
        )}

        <View style={styles.buttonContainer}>
          <Button
            mode="outlined"
            onPress={() => router.back()}
            style={styles.button}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={handleSaveWorkout}
            style={styles.button}
            loading={isLoading}
            disabled={isLoading}
          >
            Save Workout
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
    fontSize: 24,
    fontFamily: LatoFonts.bold,
    color: colors.neutral,
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontFamily: LatoFonts.bold,
    marginBottom: 8,
    marginTop: 16,
    color: colors.neutral,
  },
  input: {
    marginBottom: 8,
  },
  disabledInput: {
    backgroundColor: '#f5f5f5',
    opacity: 0.7,
  },
  dateTimeButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 16,
    marginBottom: 8,
    backgroundColor: '#fff',
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
  },
});
