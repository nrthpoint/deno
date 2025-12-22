import { Ionicons } from '@expo/vector-icons';
import { LengthUnit, WorkoutActivityType } from '@kingstinct/react-native-healthkit';
import { usePostHog } from 'posthog-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';

import AppInfo from '@/components/AppInfo/AppInfo';
import { TabBar } from '@/components/TabBar/TabBar';
import { colors } from '@/config/colors';
import { DISTANCE_UNIT_OPTIONS } from '@/config/distanceUnits';
import { LatoFonts, OrelegaOneFonts } from '@/config/fonts';
import { ANALYTICS_EVENTS, SCREEN_NAMES } from '@/constants/analytics';
import { useSettings } from '@/context/SettingsContext';
import { usePageView } from '@/hooks/usePageView';
import { subheading } from '@/utils/text';

export default function ConfigurationScreen() {
  usePageView({ screenName: SCREEN_NAMES.SETTINGS });
  const posthog = usePostHog();
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

    const numericAge = parseInt(text, 10);

    if (!isNaN(numericAge) && numericAge > 0 && numericAge <= 120) {
      setAge(numericAge);
    } else if (text === '') {
      setAge(null);
    }
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Distance Unit Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconContainer}>
              <Ionicons
                name="settings-outline"
                size={24}
                color={colors.neutral}
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.sectionTitle}>DISTANCE UNIT</Text>
              <Text style={styles.sectionSubtitle}>Choose your preferred distance measurement</Text>
            </View>
          </View>
          <TabBar
            tabs={DISTANCE_UNIT_OPTIONS.filter((option) => option.value !== 'm').map((option) => ({
              id: option.value,
              label: option.label,
              disabled: !option.enabled,
            }))}
            activeTabId={distanceUnit}
            onTabPress={(id) => {
              const newUnit = id as unknown as LengthUnit;
              setDistanceUnit(newUnit);
              posthog?.capture(ANALYTICS_EVENTS.DISTANCE_UNIT_CHANGED, {
                $screen_name: 'settings',
                new_unit: newUnit,
                previous_unit: distanceUnit,
              });
            }}
            activeTabColor={colors.primary}
          />
        </View>

        {/* Activity Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconContainer}>
              <Ionicons
                name="footsteps-outline"
                size={24}
                color={colors.neutral}
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.sectionTitle}>ACTIVITY TYPE</Text>
              <Text style={styles.sectionSubtitle}>Select your primary workout activity</Text>
            </View>
          </View>
          <TabBar
            tabs={[
              { id: String(WorkoutActivityType.running), label: 'Running' },
              { id: String(WorkoutActivityType.walking), label: 'Walking' },
            ]}
            activeTabId={String(activityType)}
            onTabPress={(value) => {
              const newActivityType = value as unknown as WorkoutActivityType;
              setActivityType(newActivityType);
              posthog?.capture(ANALYTICS_EVENTS.SETTING_CHANGED, {
                $screen_name: 'settings',
                setting: 'activity_type',
                new_value: newActivityType,
                previous_value: activityType,
              });
            }}
            activeTabColor={colors.primary}
          />
        </View>

        {/* Age Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconContainer}>
              <Ionicons
                name="calendar-outline"
                size={24}
                color={colors.neutral}
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.sectionTitle}>AGE</Text>
              <Text style={styles.sectionSubtitle}>
                Compare your performance against runners in your age group
              </Text>
            </View>
          </View>
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
              <View style={styles.ageConfirmationBox}>
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={colors.primary}
                  style={styles.ageConfirmationIcon}
                />
                <Text style={styles.ageConfirmation}>
                  Performance comparisons enabled for age {age}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Gender Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconContainer}>
              <Ionicons
                name="person-outline"
                size={24}
                color={colors.neutral}
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.sectionTitle}>GENDER</Text>
              <Text style={styles.sectionSubtitle}>
                Select your gender for more accurate performance comparisons
              </Text>
            </View>
          </View>
          <TabBar
            tabs={[
              { id: 'Male', label: 'Male' },
              { id: 'Female', label: 'Female' },
              { id: 'Other', label: 'Other' },
            ]}
            activeTabId={gender || ''}
            onTabPress={(id) => {
              const newGender = id as 'Male' | 'Female' | 'Other';
              setGender(newGender);
              posthog?.capture(ANALYTICS_EVENTS.SETTING_CHANGED, {
                $screen_name: 'settings',
                setting: 'gender',
                new_value: newGender,
                previous_value: gender,
              });
            }}
            activeTabColor={colors.primary}
          />
        </View>

        {/* App Info Section */}
        <View style={[styles.section, { borderBottomWidth: 0 }]}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconContainer}>
              <Ionicons
                name="information-circle-outline"
                size={24}
                color={colors.neutral}
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.sectionTitle}>APP INFO</Text>
              <Text style={styles.sectionSubtitle}>Version information and updates</Text>
            </View>
          </View>
          <AppInfo />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 80,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: colors.surface,
  },
  headerTitle: {
    color: colors.neutral,
    fontSize: 40,
    fontFamily: OrelegaOneFonts.regular,
  },
  scrollView: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  section: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceHighlight,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    //marginTop: -4,
  },
  textContainer: {
    flex: 1,
  },
  sectionTitle: {
    ...subheading,
    color: colors.neutral,
    fontFamily: LatoFonts.bold,
    marginTop: 0,
    fontSize: 12,
    marginBottom: 6,
  },
  sectionSubtitle: {
    color: colors.lightGray,
    fontFamily: LatoFonts.regular,
    fontSize: 14,
  },
  ageInputContainer: {
    marginTop: 10,
  },
  ageInput: {
    width: '100%',
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
  ageConfirmationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginTop: 4,
  },
  ageConfirmationIcon: {
    marginRight: 8,
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 2,
  },
  ageConfirmation: {
    flex: 1,
    fontSize: 14,
    fontFamily: LatoFonts.regular,
    color: colors.neutral,
    lineHeight: 20,
  },
});
