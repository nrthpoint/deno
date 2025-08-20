import Constants from 'expo-constants';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';

const packageJson = require('../../package.json');

export default function AppInfo() {
  return (
    <>
      <Text variant="titleLarge" style={styles.heading}>
        App Information
      </Text>
      <View style={styles.versionContainer}>
        <View style={styles.versionRow}>
          <Text variant="bodyMedium" style={styles.versionLabel}>
            App Version
          </Text>
          <Text variant="bodyMedium" style={styles.versionValue}>
            {packageJson.version}
          </Text>
        </View>
        <View style={styles.versionRow}>
          <Text variant="bodyMedium" style={styles.versionLabel}>
            Build Number
          </Text>
          <Text variant="bodyMedium" style={styles.versionValue}>
            {Constants.expoConfig?.version || packageJson.version}
          </Text>
        </View>
        <View style={styles.versionRow}>
          <Text variant="bodyMedium" style={styles.versionLabel}>
            Runtime Version
          </Text>
          <Text variant="bodyMedium" style={styles.versionValue}>
            {typeof Constants.expoConfig?.runtimeVersion === 'string'
              ? Constants.expoConfig.runtimeVersion
              : Constants.expoConfig?.runtimeVersion?.policy || packageJson.version}
          </Text>
        </View>
        <View style={styles.versionRow}>
          <Text variant="bodyMedium" style={styles.versionLabel}>
            Update Channel
          </Text>
          <Text variant="bodyMedium" style={styles.versionValue}>
            {Constants.expoConfig?.updates?.requestHeaders?.['expo-channel-name'] || 'N/A'}
          </Text>
        </View>
        <View style={styles.versionRow}>
          <Text variant="bodyMedium" style={styles.versionLabel}>
            Platform
          </Text>
          <Text variant="bodyMedium" style={styles.versionValue}>
            {`${Constants.platform?.ios ? 'iOS' : 'Other'} ${Constants.platform?.ios?.buildNumber || ''}`.trim()}
          </Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 24,
    fontFamily: LatoFonts.bold,
    marginBottom: 0,
    marginTop: 16,
    color: colors.neutral,
  },
  versionContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  versionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  versionLabel: {
    color: colors.neutral,
    fontFamily: LatoFonts.regular,
  },
  versionValue: {
    color: colors.surfaceHighlight,
    fontFamily: LatoFonts.bold,
  },
});
