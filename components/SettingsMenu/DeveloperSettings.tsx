import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Switch, Text } from 'react-native-paper';

import { Card } from '@/components/Card/Card';
import { useTutorialDebug } from '@/components/Tutorial/useTutorialDebug';
import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
import { clearPreviousAchievements } from '@/services/achievements';

export const DeveloperSettings: React.FC = () => {
  const { isDebugEnabled, toggleDebug } = useTutorialDebug();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {__DEV__ && (
        <Card>
          <View style={styles.cardContent}>
            <Text
              variant="titleLarge"
              style={[styles.heading, { marginTop: 0 }]}
            >
              Tutorial Debug Mode
            </Text>
            <Text style={styles.subheading}>
              Interactive tutorial editor with live preview and export.
            </Text>

            <View style={styles.switchContainer}>
              <View style={styles.switchLabel}>
                <Text style={styles.switchText}>Enable Tutorial Debugger</Text>
                <Text style={styles.buttonDescription}>
                  Shows a debug button on the home screen to edit tutorial steps in real-time
                </Text>
              </View>
              <Switch
                value={isDebugEnabled}
                onValueChange={toggleDebug}
                color={colors.primary}
              />
            </View>
          </View>
        </Card>
      )}

      <Card>
        <View style={styles.cardContent}>
          <Text
            variant="titleLarge"
            style={[styles.heading, { marginTop: 0 }]}
          >
            Achievement Debug
          </Text>
          <Text style={styles.subheading}>Debug and test achievement detection.</Text>

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
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    gap: 16,
  },
  switchLabel: {
    flex: 1,
  },
  switchText: {
    fontSize: 14,
    fontFamily: LatoFonts.bold,
    color: colors.neutral,
    marginBottom: 4,
  },
});
