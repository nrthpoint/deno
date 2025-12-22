import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
import { subheading } from '@/utils/text';

interface SectionHeaderProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ icon, title, subtitle }) => {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.iconContainer}>
        <Ionicons
          name={icon as any}
          size={20}
          color={colors.neutral}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.sectionSubtitle}>{subtitle}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    marginTop: -2,
  },
  textContainer: {
    flex: 1,
  },
  sectionTitle: {
    ...subheading,
    color: colors.neutral,
    fontFamily: LatoFonts.bold,
    marginTop: 0,
    fontSize: 12,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  sectionSubtitle: {
    color: colors.lightGray,
    fontFamily: LatoFonts.regular,
    fontSize: 14,
  },
});
