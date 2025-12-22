import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';

import { SectionHeader } from '@/components/SettingsMenu/SectionHeader';
import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
import { useSettings } from '@/context/SettingsContext';
import { uppercase } from '@/utils/text';

export const AgeSection: React.FC = () => {
  const { age, setAge } = useSettings();
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
    <View style={styles.section}>
      <SectionHeader
        icon="calendar-sharp"
        title="Age"
        subtitle="Compare your performance against runners in your age group"
      />
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
            <Text style={styles.ageConfirmation}>Performance rankings enabled for age {age}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceHighlight,
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
    marginRight: 10,
    backgroundColor: colors.neutral,
    borderRadius: 10,
  },
  ageConfirmation: {
    ...uppercase,
    fontSize: 10,
    flex: 1,
    fontFamily: LatoFonts.regular,
    color: colors.neutral,
    //lineHeight: 20,
  },
});
