import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

import { Card } from '@/components/Card/Card';
import { NotificationTestCard } from '@/components/NotificationSettings/NotificationTestCard';
import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
import { clearPreviousAchievements, showTestAchievementNotification } from '@/utils/achievements';

export const DeveloperSettings: React.FC = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <NotificationTestCard />

      <Card>
        <View style={styles.cardContent}>
          <Text
            variant="titleLarge"
            style={[styles.heading, { marginTop: 0 }]}
          >
            Developer Testing
          </Text>
          <Text style={styles.subheading}>
            Test achievement notifications and reset stored data.
          </Text>

          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={showTestAchievementNotification}
              style={styles.testButton}
              labelStyle={styles.buttonText}
            >
              Test Achievement Notification
            </Button>

            <Button
              mode="outlined"
              onPress={clearPreviousAchievements}
              style={styles.clearButton}
              labelStyle={styles.buttonText}
            >
              Clear Achievement History
            </Button>
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
  testButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
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
});
