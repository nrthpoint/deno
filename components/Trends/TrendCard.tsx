import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors } from '@/config/colors';

interface TrendCardProps {
  title: string;
  description: string;
  onPress: () => void;
}

export const TrendCard: React.FC<TrendCardProps> = ({ title, description, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    marginVertical: 10,
    shadowColor: '#2b2b2b',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  description: {
    color: '#bbb',
    fontSize: 15,
  },
});
