import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { Warning } from '@/components/Warning/Warning';

import { useOTAUpdate } from './useOTAUpdate';

interface OTAUpdatePromptProps {
  /**
   * Whether to auto-download update when available
   * If false, user must tap to download
   */
  autoDownload?: boolean;
}

/**
 * OTA Update Prompt Component
 *
 * Displays a warning banner when an over-the-air update is available.
 * User can tap to download and apply the update.
 *
 * Only shows in production builds - automatically hidden in dev mode.
 */
export const OTAUpdatePrompt: React.FC<OTAUpdatePromptProps> = ({ autoDownload = false }) => {
  const { isUpdateAvailable, isDownloading, isUpdatePending, downloadUpdate, applyUpdate } =
    useOTAUpdate();

  // Auto-download if enabled and update is available
  useEffect(() => {
    if (autoDownload && isUpdateAvailable && !isDownloading) {
      downloadUpdate();
    }
  }, [autoDownload, isUpdateAvailable, isDownloading, downloadUpdate]);

  // Update is available - prompt to download
  if (isUpdateAvailable && !isDownloading) {
    return (
      <View style={styles.container}>
        <Warning
          message="A new version is available. **Tap to update**"
          actionHint="Your app will reload to apply the update"
          variant="touchable"
          onPress={downloadUpdate}
        />
      </View>
    );
  }

  // Update is downloading
  if (isDownloading) {
    return (
      <View style={styles.container}>
        <Warning message="Downloading update..." />
      </View>
    );
  }

  // Update is downloaded and pending - prompt to apply
  if (isUpdatePending) {
    return (
      <View style={styles.container}>
        <Warning
          message="Update ready! **Tap to restart and apply**"
          actionHint="Your progress will be saved"
          variant="touchable"
          onPress={applyUpdate}
        />
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
