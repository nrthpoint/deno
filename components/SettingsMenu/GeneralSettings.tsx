import { LengthUnit, WorkoutActivityType } from '@kingstinct/react-native-healthkit';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';

import { TabBar } from '@/components/TabBar/TabBar';
import { colors } from '@/config/colors';
import { DISTANCE_UNIT_OPTIONS } from '@/config/distanceUnits';
import { LatoFonts } from '@/config/fonts';
import { useSettings } from '@/context/SettingsContext';

export const GeneralSettings: React.FC = () => {
  const {
    distanceUnit,
    activityType,
    age,
    gender,
    setDistanceUnit,
    setActivityType,
    setAge,
    setGender,
  } = useSettings();

  const [ageInput, setAgeInput] = useState(age?.toString() || '');

  const handleAgeChange = (text: string) => {
    setAgeInput(text);

    // Validate and save age
    const numericAge = parseInt(text, 10);

    if (!isNaN(numericAge) && numericAge > 0 && numericAge <= 120) {
      setAge(numericAge);
    } else if (text === '') {
      setAge(null);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text
        variant="titleLarge"
        style={[styles.heading, { marginTop: 0 }]}
      >
        Distance Unit
      </Text>

      <TabBar
        tabs={DISTANCE_UNIT_OPTIONS.map((option) => ({
          id: option.value,
          label: option.label,
          disabled: !option.enabled,
        }))}
        activeTabId={distanceUnit}
        onTabPress={(id) => setDistanceUnit(id as unknown as LengthUnit)}
        activeTabColor={colors.primary}
      />

      <Text
        variant="titleLarge"
        style={styles.heading}
      >
        Activity
      </Text>

      <TabBar
        tabs={[
          { id: String(WorkoutActivityType.running), label: 'Running' },
          { id: String(WorkoutActivityType.walking), label: 'Walking' },
          { id: String(WorkoutActivityType.cycling), label: 'Cycling', disabled: true },
        ]}
        activeTabId={String(activityType)}
        onTabPress={(value) => setActivityType(value as unknown as WorkoutActivityType)}
        activeTabColor={colors.primary}
      />

      <Text
        variant="titleLarge"
        style={styles.heading}
      >
        Age
      </Text>
      <Text style={styles.subheading}>
        Enter your age to compare your performance against runners in your age group.
      </Text>

      <View style={styles.ageInputContainer}>
        <TextInput
          mode="outlined"
          value={ageInput}
          onChangeText={handleAgeChange}
          placeholder="Enter your age"
          keyboardType="numeric"
          maxLength={3}
          style={styles.ageInput}
          theme={{
            colors: {
              primary: colors.primary,
              outline: colors.surface,
              onSurfaceVariant: colors.neutral,
              surface: colors.background,
            },
          }}
          contentStyle={styles.ageInputContent}
          outlineStyle={styles.ageInputOutline}
        />
        {age && (
          <Text style={styles.ageConfirmation}>Performance comparisons enabled for age {age}</Text>
        )}
      </View>

      <Text
        variant="titleLarge"
        style={styles.heading}
      >
        Gender
      </Text>
      <Text style={styles.subheading}>
        Select your gender for more accurate performance comparisons.
      </Text>

      <TabBar
        tabs={[
          { id: 'Male', label: 'Male' },
          { id: 'Female', label: 'Female' },
          { id: 'Other', label: 'Other' },
        ]}
        activeTabId={gender || ''}
        onTabPress={(id) => setGender(id as 'Male' | 'Female' | 'Other')}
        activeTabColor={colors.primary}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  heading: {
    marginTop: 30,
    marginBottom: 15,
    fontSize: 18,
    fontFamily: LatoFonts.bold,
    color: colors.neutral,
  },
  subheading: {
    fontSize: 16,
    fontFamily: LatoFonts.regular,
    color: colors.neutral,
    marginTop: -10,
    marginBottom: 10,
    lineHeight: 22,
  },
  ageInputContainer: {
    marginBottom: 10,
  },
  ageInput: {
    width: 120,
    marginBottom: 8,
  },
  ageInputContent: {
    fontSize: 16,
    fontFamily: LatoFonts.regular,
    color: colors.neutral,
  },
  ageInputOutline: {
    borderColor: colors.surface,
    borderRadius: 8,
  },
  ageConfirmation: {
    fontSize: 14,
    fontFamily: LatoFonts.regular,
    color: colors.primary,
    fontStyle: 'italic',
  },
});
