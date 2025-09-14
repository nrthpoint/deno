import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { LatoFonts } from '@/config/fonts';

interface GroupSummaryHeaderProps {
  summary: string;
}

const renderTextWithBold = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const boldText = part.slice(2, -2);
      return (
        <Text
          key={index}
          style={[styles.summaryText, styles.boldText]}
        >
          {boldText}
        </Text>
      );
    }
    return (
      <Text
        key={index}
        style={styles.summaryText}
      >
        {part}
      </Text>
    );
  });
};

export const GroupSummaryHeader: React.FC<GroupSummaryHeaderProps> = ({ summary }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.summaryText}>{renderTextWithBold(summary)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  summaryText: {
    color: '#CCCCCC',
    fontSize: 16,
    fontFamily: LatoFonts.regular,
    lineHeight: 28,
  },
  boldText: {
    fontFamily: LatoFonts.bold,
    color: '#FFFFFF',
  },
});
