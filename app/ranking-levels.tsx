import { Ionicons } from '@expo/vector-icons';
import { LengthUnit } from '@kingstinct/react-native-healthkit';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

import { LevelsList } from '@/components/RankingLevels/LevelsList';
import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
import { useSettings } from '@/context/SettingsContext';

export default function RankingLevelsModal() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    distance?: string;
    duration?: string;
    unit?: LengthUnit;
  }>();

  const distance = Number(params.distance) || 5;
  const time = Number(params.duration) || 0;
  const unit = params.unit || 'km';

  const { age, gender } = useSettings();

  if (age === null || gender === null) {
    throw new Error('Age and gender must be set in settings to view ranking levels.');
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: `${distance}K Performance Levels`,
          headerStyle: { backgroundColor: colors.background },
          headerTitleStyle: {
            color: colors.neutral,
            fontFamily: LatoFonts.bold,
            fontSize: 18,
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Ionicons
                name="chevron-back"
                size={24}
                color={colors.neutral}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <LevelsList
          distance={distance}
          unit={unit}
          age={age}
          gender={gender}
          time={time}
        />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  backButton: {
    marginLeft: 8,
    padding: 8,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: 16,
  },
});
