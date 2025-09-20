import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';

import { LatoFonts } from '@/config/fonts';
import { subheading, uppercase } from '@/utils/text';

export interface WarningProps {
  title: string;
  message: string;
  icon?: string;
  onPress?: () => void;
  actionHint?: string;
  variant?: 'default' | 'touchable';
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

export const Warning: React.FC<WarningProps> = ({
  title,
  message,
  icon = '⚠️',
  onPress,
  actionHint,
  variant = 'default',
}) => {
  const Container = variant === 'touchable' && onPress ? TouchableOpacity : View;
  const containerProps = variant === 'touchable' && onPress ? { onPress, activeOpacity: 0.8 } : {};

  return (
    <Container
      style={styles.container}
      {...containerProps}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{renderMessageWithBold(message)}</Text>
        {actionHint && <Text style={styles.actionHint}>{actionHint}</Text>}
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    borderRadius: 8,
    padding: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 10,
  },
  icon: {
    fontSize: 18,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    ...subheading,
    marginTop: 0,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFC107',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  message: {
    color: '#CCCCCC',
    fontSize: 11,
    lineHeight: 16,
    fontFamily: LatoFonts?.regular,
  },
  boldMessage: {
    fontFamily: LatoFonts?.bold,
    color: '#FFC107',
  },
  actionHint: {
    ...uppercase,
    color: '#FFF',
    fontSize: 10,
    fontFamily: LatoFonts?.bold,
    marginTop: 6,
    marginBottom: 0,
  },
});
