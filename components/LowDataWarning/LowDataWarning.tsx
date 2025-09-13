import React from 'react';
import { StyleSheet, View } from 'react-native';
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
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>⚠️</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Limited Data</Text>
        <Text style={styles.message}>{renderMessageWithBold(message)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
    //borderRadius: 8,
    padding: 15,
    marginHorizontal: 10,
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
});
