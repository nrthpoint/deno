import React from 'react';
import { StyleSheet, View } from 'react-native';

import { colors } from '@/config/colors';

import { CardProps } from './Card.types';

export const Card = ({ children, backgroundColor = colors.surface, style }: CardProps) => {
  return (
    <View style={[styles.container, { backgroundColor }, style]}>
      <View style={styles.innerContainer}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    marginVertical: 8,
    elevation: 2,
    shadowColor: '#272727',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  innerContainer: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
});
