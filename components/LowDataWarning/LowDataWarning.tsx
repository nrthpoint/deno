import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';

import { LatoFonts } from '@/config/fonts';
import { subheading } from '@/utils/text';

interface LowDataWarningProps {
  message: string;
}

const renderMessageWithBold = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const boldText = part.slice(2, -2);
      return (
        <Text
          key={index}
          style={[styles.message, styles.boldMessage]}
        >
          {boldText}
        </Text>
      );
    }
    return (
      <Text
        key={index}
        style={styles.message}
      >
        {part}
      </Text>
    );
  });
};

export const LowDataWarning: React.FC<LowDataWarningProps> = ({ message }) => {
  const handlePress = () => {
    router.push('/settings?section=general');
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>⚠️</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Limited Data</Text>
        <Text style={styles.message}>{renderMessageWithBold(message)}</Text>
        <Text style={styles.tapHint}>Tap to adjust time range</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    ...subheading,
    marginTop: 0,
    color: '#FFC107',
    fontSize: 12,
    fontFamily: LatoFonts.bold,
    marginBottom: 4,
  },
  message: {
    color: '#CCCCCC',
    fontSize: 12,
    fontFamily: LatoFonts.regular,
    lineHeight: 20,
  },
  boldMessage: {
    fontFamily: LatoFonts.bold,
    color: '#FFC107',
  },
  tapHint: {
    color: '#FFC107',
    fontSize: 10,
    fontFamily: LatoFonts.bold,
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
