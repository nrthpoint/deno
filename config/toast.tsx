import React from 'react';
import { StyleSheet } from 'react-native';
import { BaseToast, ErrorToast } from 'react-native-toast-message';

export const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={styles.successToast}
      contentContainerStyle={styles.contentContainer}
      text1Style={styles.text1}
      text2Style={styles.text2}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={styles.errorToast}
      contentContainerStyle={styles.contentContainer}
      text1Style={styles.text1}
      text2Style={styles.text2}
    />
  ),
  info: (props: any) => (
    <BaseToast
      {...props}
      style={styles.infoToast}
      contentContainerStyle={styles.contentContainer}
      text1Style={styles.text1}
      text2Style={styles.text2}
    />
  ),
};

const styles = StyleSheet.create({
  successToast: {
    borderLeftColor: '#22c55e',
    backgroundColor: '#f0fdf4',
  },
  errorToast: {
    borderLeftColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  infoToast: {
    borderLeftColor: '#050941',
    backgroundColor: '#ffcf21',
    color: '#ffffff',
  },
  contentContainer: {
    paddingHorizontal: 15,
  },
  text1: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1f2937',
  },
  text2: {
    fontSize: 10,
    color: '#111111',
  },
  /*   text1Dark: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  text2Dark: {
    fontSize: 10,
    color: '#d1d5db',
  }, */
});
