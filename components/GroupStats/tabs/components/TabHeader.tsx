import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { LatoFonts } from '@/config/fonts';

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
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: LatoFonts.bold,
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 5,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  sectionDescription: {
    color: '#CCCCCC',
    fontSize: 14,
    fontFamily: LatoFonts.regular,
    marginBottom: 20,
    paddingHorizontal: 5,
    lineHeight: 20,
  },
});
