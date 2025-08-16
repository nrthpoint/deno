import { View, StyleSheet, Text } from 'react-native';

import { colors } from '@/config/colors';
import { subheading } from '@/utils/text';

import { AchievementBadge as AchievementBadgeType } from './StatCard.utils';

export const AchievementBadge = ({ achievement }: { achievement: AchievementBadgeType }) => {
  const { label, color } = achievement;

  return (
    <View style={[styles.achievementBadge, { backgroundColor: color }]}>
      <Text style={styles.achievementText}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  achievementBadge: {
    position: 'absolute',
    right: -5,
    top: -10,
    backgroundColor: colors.primary,
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    zIndex: 1,
  },
  achievementText: {
    ...subheading,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
