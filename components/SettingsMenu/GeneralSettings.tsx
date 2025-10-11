import { LengthUnit, WorkoutActivityType } from '@kingstinct/react-native-healthkit';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';

import { CardSlider } from '@/components/CardSlider/CardSlider';
import { TabBar } from '@/components/TabBar/TabBar';
import { colors } from '@/config/colors';
import { DISTANCE_UNIT_OPTIONS } from '@/config/distanceUnits';
import { LatoFonts } from '@/config/fonts';
import { TIME_RANGE_LABELS, TIME_RANGE_OPTIONS } from '@/config/timeRanges';
import { useSettings } from '@/context/SettingsContext';

export const GeneralSettings: React.FC = () => {
  const {
    distanceUnit,
    activityType,
    timeRangeInDays: timeRange,
    age,
    setDistanceUnit,
    setActivityType,
    setTimeRange,
    setAge,
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

      <View>
        <Text
          variant="titleLarge"
          style={[styles.heading]}
        >
          Time Range
        </Text>
        <Text style={styles.subheading}>The amount of time from now, to fetch workout data.</Text>

        <CardSlider
          title={TIME_RANGE_LABELS[timeRange]}
          value={TIME_RANGE_OPTIONS.findIndex((option) => option.value === timeRange)}
          minimumValue={0}
          maximumValue={TIME_RANGE_OPTIONS.length - 1}
          step={1}
          onValueChange={(sliderValue) => {
            const index = Math.round(sliderValue);
            setTimeRange(TIME_RANGE_OPTIONS[index].value);
          }}
          minimumLabel={TIME_RANGE_OPTIONS[0].label}
          maximumLabel={TIME_RANGE_OPTIONS[TIME_RANGE_OPTIONS.length - 1].label}
          thumbColor="#424bff"
          minimumTrackColor={colors.neutral}
          maximumTrackColor="#121212"
          formatValue={() => ''}
        />
      </View>
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
