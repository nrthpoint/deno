import * as Application from 'expo-application';
import Constants from 'expo-constants';
import * as Updates from 'expo-updates';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';

export default function AppInfo() {
  const version = Application.nativeApplicationVersion ?? 'unknown';
  const buildNumber = Application.nativeBuildVersion ?? 'unknown';
  const updateId = Updates.updateId ?? 'unknown';
  const runtimeVId = Updates.manifest?.id ?? 'unknown';
  const updateChannel =
    Constants.expoConfig?.updates?.requestHeaders?.['expo-channel-name'] ?? 'N/A';

  return (
    <>
      <Text
        variant="titleLarge"
        style={styles.heading}
      >
        App Information
      </Text>
      <View style={styles.versionContainer}>
        <View style={styles.versionRow}>
          <Text
            variant="bodyMedium"
            style={styles.versionLabel}
          >
            App Version
          </Text>
          <Text
            variant="bodyMedium"
            style={styles.versionValue}
          >
            {version}
          </Text>
        </View>
        <View style={styles.versionRow}>
          <Text
            variant="bodyMedium"
            style={styles.versionLabel}
          >
            Build Number
          </Text>
          <Text
            variant="bodyMedium"
            style={styles.versionValue}
          >
            {buildNumber}
          </Text>
        </View>
        <View style={styles.versionRow}>
          <Text
            variant="bodyMedium"
            style={styles.versionLabel}
          >
            Update ID
          </Text>
          <Text
            variant="bodyMedium"
            style={styles.versionValue}
          >
            {updateId}
          </Text>
        </View>
        <View style={styles.versionRow}>
          <Text
            variant="bodyMedium"
            style={styles.versionLabel}
          >
            Runtime Version
          </Text>
          <Text
            variant="bodyMedium"
            style={styles.versionValue}
          >
            {runtimeVId}
          </Text>
        </View>
        <View style={styles.versionRow}>
          <Text
            variant="bodyMedium"
            style={styles.versionLabel}
          >
            Update Channel
          </Text>
          <Text
            variant="bodyMedium"
            style={styles.versionValue}
          >
            {updateChannel}
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
    color: colors.lightGray,
    fontFamily: LatoFonts.regular,
  },
  versionValue: {
    color: colors.neutral,
    fontFamily: LatoFonts.bold,
  },
});
