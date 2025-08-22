import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { colors } from '@/config/colors';

export const RotatePhone = () => {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name="phone-rotate-landscape"
        size={64}
        color="#fff"
        style={styles.icon}
      />
      <Text style={styles.heading}>Rotate your phone</Text>
      <Text style={styles.subtext}>
        For the best experience, please rotate your device to landscape.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: colors.background,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  icon: {
    marginBottom: 24,
  },
  heading: {
    fontFamily: 'OrelegaOne',
    fontSize: 28,
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtext: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 4,
    maxWidth: '80%',
    lineHeight: 24,
  },
});
