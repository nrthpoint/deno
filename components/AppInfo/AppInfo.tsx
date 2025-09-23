import * as Application from 'expo-application';
import Constants from 'expo-constants';
import * as Updates from 'expo-updates';
import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

import { Warning } from '@/components/Warning';
import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
import { subheading } from '@/utils/text';

export default function AppInfo() {
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState<Date | null>(null);
  const [showFullUpdateId, setShowFullUpdateId] = useState(false);

  const version = Application.nativeApplicationVersion ?? 'unknown';
  const buildNumber = Application.nativeBuildVersion ?? 'unknown';
  const updateId = Updates.updateId ?? 'unknown';
  const updateChannel =
    Constants.expoConfig?.updates?.requestHeaders?.['expo-channel-name'] ?? 'N/A';
  const isDevelopment = __DEV__ || !Updates.isEnabled;

  const handleCheckForUpdates = async () => {
    if (isDevelopment) {
      Alert.alert(
        'Development Mode',
        'Updates are not available in development mode. Build the app and install it to test updates.',
        [{ text: 'OK' }],
      );
      return;
    }

    try {
      setIsCheckingUpdate(true);
      setLastCheckTime(new Date());

      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        Alert.alert(
          'Update Available',
          'A new update is available. Would you like to download and install it now?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Update Now',
              onPress: handleForceUpdate,
            },
          ],
        );
      } else {
        Alert.alert('No Updates', 'You are running the latest version.', [{ text: 'OK' }]);
      }
    } catch (error) {
      console.error('Error checking for updates:', error);
      Alert.alert('Update Check Failed', 'Unable to check for updates. Please try again later.', [
        { text: 'OK' },
      ]);
    } finally {
      setIsCheckingUpdate(false);
    }
  };

  const handleForceUpdate = async () => {
    if (isDevelopment) {
      Alert.alert('Development Mode', 'Force updates are not available in development mode.', [
        { text: 'OK' },
      ]);
      return;
    }

    try {
      setIsCheckingUpdate(true);

      Alert.alert(
        'Downloading Update',
        'Downloading the latest update... The app will restart when complete.',
        [{ text: 'OK' }],
      );

      const result = await Updates.fetchUpdateAsync();

      if (result.isNew) {
        await Updates.reloadAsync();
      } else {
        Alert.alert('No Update', 'No new update was found.', [{ text: 'OK' }]);
      }
    } catch (error) {
      console.error('Error forcing update:', error);

      Alert.alert(
        'Update Failed',
        'Failed to download the update. Please check your internet connection and try again.',
        [{ text: 'OK' }],
      );
    } finally {
      setIsCheckingUpdate(false);
    }
  };

  const formatUpdateId = (id: string) => {
    if (id === 'unknown' || !id) return 'unknown';

    return showFullUpdateId || id.length <= 8 ? id : `${id.substring(0, 8)}...`;
  };

  const handleUpdateIdPress = () => {
    if (updateId !== 'unknown' && updateId.length > 8) {
      setShowFullUpdateId(!showFullUpdateId);
    }
  };

  const copyUpdateIdToClipboard = async () => {
    if (updateId !== 'unknown') {
      Alert.alert('Update ID', updateId, [{ text: 'OK' }]);
    }
  };

  const formatTimestamp = (date: Date | null) => {
    if (!date) return 'Never';

    return date.toLocaleTimeString();
  };

  return (
    <>
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

        <Pressable
          style={styles.versionRow}
          onPress={handleUpdateIdPress}
          onLongPress={copyUpdateIdToClipboard}
        >
          <Text
            variant="bodyMedium"
            style={styles.versionLabel}
          >
            Update ID{' '}
            {updateId !== 'unknown' && updateId.length > 8 && (
              <Text style={styles.tapHint}>
                (tap to {showFullUpdateId ? 'collapse' : 'expand'})
              </Text>
            )}
          </Text>
          <Text
            variant="bodyMedium"
            style={[
              styles.versionValue,
              updateId !== 'unknown' && updateId.length > 8 && styles.clickableText,
            ]}
          >
            {formatUpdateId(updateId)}
          </Text>
        </Pressable>

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

        {!isDevelopment && (
          <View style={styles.versionRow}>
            <Text
              variant="bodyMedium"
              style={styles.versionLabel}
            >
              Last Update Check
            </Text>
            <Text
              variant="bodyMedium"
              style={styles.versionValue}
            >
              {formatTimestamp(lastCheckTime)}
            </Text>
          </View>
        )}
      </View>

      {/* Update Controls */}
      <View style={styles.updateContainer}>
        <Text style={styles.updateTitle}>📱 Updates</Text>

        {isDevelopment ? (
          <View style={styles.developmentNotice}>
            <Warning message="You are running a development build. Update checks and installations are disabled. To test updates, create a production build of the app and install it on your device." />
          </View>
        ) : (
          <View style={styles.updateControls}>
            <Text style={styles.updateDescription}>
              Check for the latest app updates or force download the newest version
            </Text>

            <View style={styles.buttonRow}>
              <Button
                mode="outlined"
                onPress={handleCheckForUpdates}
                disabled={isCheckingUpdate}
                style={styles.updateButton}
                labelStyle={{ color: colors.neutral }}
                loading={isCheckingUpdate}
              >
                Check for Updates
              </Button>

              <Button
                mode="contained"
                onPress={handleForceUpdate}
                disabled={isCheckingUpdate}
                style={styles.forceUpdateButton}
                labelStyle={{ color: colors.neutral }}
                loading={isCheckingUpdate}
              >
                Force Update
              </Button>
            </View>
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
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
    ...subheading,
    marginTop: 0,
    color: colors.neutral,
    fontFamily: LatoFonts.regular,
  },
  versionValue: {
    color: colors.neutral,
    fontFamily: LatoFonts.bold,
  },
  updateContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  updateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.neutral,
    marginBottom: 12,
    fontFamily: LatoFonts.bold,
  },
  updateDescription: {
    color: colors.lightGray,
    fontFamily: LatoFonts.regular,
    marginBottom: 16,
    lineHeight: 20,
  },
  updateControls: {
    gap: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  updateButton: {
    flex: 1,
    borderColor: colors.neutral,
  },
  forceUpdateButton: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  developmentNotice: {
    marginTop: 8,
  },
  tapHint: {
    color: colors.lightGray,
    fontSize: 10,
    fontStyle: 'italic',
  },
  clickableText: {
    textDecorationLine: 'underline',
    color: colors.primary,
  },
});
