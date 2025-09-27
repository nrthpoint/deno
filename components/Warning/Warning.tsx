import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Text } from 'react-native-paper';

import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';

export interface WarningProps {
  title?: string;
  message: string;
  icon?: string;
  onPress?: () => void;
  actionHint?: string;
  variant?: 'default' | 'touchable';
  style?: ViewStyle;
  labelStyle?: TextStyle;
  iconColor?: string;
}

const renderMessageWithBold = (text: string, labelStyle?: TextStyle) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const boldText = part.slice(2, -2);

      return (
        <Text
          key={index}
          style={[styles.message, styles.boldMessage, labelStyle]}
        >
          {boldText}
        </Text>
      );
    }

    return (
      <Text
        key={index}
        style={[styles.message, labelStyle]}
      >
        {part}
      </Text>
    );
  });
};

export const Warning: React.FC<WarningProps> = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  title,
  message,
  onPress,
  actionHint,
  variant = 'default',
  style,
  labelStyle,
  iconColor,
}) => {
  const Container = variant === 'touchable' && onPress ? TouchableOpacity : View;
  const containerProps = variant === 'touchable' && onPress ? { onPress, activeOpacity: 0.8 } : {};

  return (
    <Container
      style={[styles.container, style]}
      {...containerProps}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>
          <Ionicons
            name="warning"
            color={iconColor || colors.background}
            size={28}
          />
        </Text>
      </View>
      <View style={styles.textContainer}>
        {/* <Text style={styles.title}>{title}</Text> */}
        <Text>{renderMessageWithBold(message, labelStyle)}</Text>
        {actionHint && <Text style={[styles.actionHint, labelStyle]}>{actionHint}</Text>}
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgb(255, 193, 7)', // 'rgba(255, 193, 7, 0.1)',
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
  message: {
    color: colors.background,
    fontSize: 12,
    lineHeight: 20,
    fontFamily: LatoFonts?.regular,
  },
  boldMessage: {
    fontFamily: LatoFonts?.bold,
    color: colors.background,
  },
  actionHint: {
    color: colors.background,
    fontSize: 12,
    fontFamily: LatoFonts?.bold,
    marginTop: 6,
    marginBottom: 0,
  },
});
