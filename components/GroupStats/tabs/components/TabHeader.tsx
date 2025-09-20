import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { LatoFonts } from '@/config/fonts';
import { uppercase } from '@/utils/text';

export const TabHeader = ({ title, description }: { title: string; description: string }) => {
  return (
    <>
      <Text style={styles.sectionHeader}>{title}</Text>
      <Text style={styles.sectionDescription}>{description}</Text>
    </>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    ...uppercase,
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: LatoFonts.bold,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  sectionDescription: {
    color: '#CCCCCC',
    fontSize: 14,
    fontFamily: LatoFonts.regular,
    marginBottom: 20,
    lineHeight: 22,
  },
});
