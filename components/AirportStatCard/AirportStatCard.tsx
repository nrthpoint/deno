import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { Card } from '@/components/Card/Card';
import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
import { subheading } from '@/utils/text';

interface AirportStatCardProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  value?: string | number;
}

export const AirportStatCard: React.FC<AirportStatCardProps> = ({ icon, value, label }) => {
  return (
    <Card style={styles.card}>
      <View style={styles.content}>
        <MaterialCommunityIcons
          name={icon}
          size={24}
          color={colors.neutral}
          style={styles.icon}
        />
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'transparent',
    color: colors.neutral,
  },
  content: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  icon: {
    marginBottom: 14,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
  },
  value: {
    fontSize: 20,
    fontFamily: LatoFonts.bold,
    color: colors.background,
    marginBottom: 4,
  },
  label: {
    ...subheading,
    marginBottom: 0,
    marginTop: 5,
    fontFamily: LatoFonts.regular,
    color: colors.background,
  },
});
