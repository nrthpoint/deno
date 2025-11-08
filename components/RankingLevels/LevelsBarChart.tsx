import { Quantity } from '@kingstinct/react-native-healthkit';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
import { Level } from '@/services/rankingService/types';
import { formatPace } from '@/utils/pace';

interface LevelsBarChartProps {
  levels: Level[];
  userPace?: Quantity;
  height?: number;
}

// Heat map colors from cold (fastest/best) to hot (slowest)
const getHeatMapColor = (index: number, total: number): string => {
  // Handle edge cases
  if (total <= 1) {
    return 'hsl(200, 100%, 70%)'; // Default blue for single item
  }

  const ratio = index / (total - 1); // 0 to 1, where 0 is fastest (cold), 1 is slowest (hot)

  if (ratio <= 0.2) {
    // Cold blue to cyan (fastest levels)
    return `hsl(${200 + ratio * 50}, 100%, ${65 + ratio * 15}%)`;
  } else if (ratio <= 0.4) {
    // Cyan to green
    const localRatio = (ratio - 0.2) / 0.2;
    return `hsl(${180 - localRatio * 60}, 100%, ${70 + localRatio * 10}%)`;
  } else if (ratio <= 0.6) {
    // Green to yellow
    const localRatio = (ratio - 0.4) / 0.2;
    return `hsl(${120 - localRatio * 60}, 100%, ${75 + localRatio * 5}%)`;
  } else if (ratio <= 0.8) {
    // Yellow to orange
    const localRatio = (ratio - 0.6) / 0.2;
    return `hsl(${60 - localRatio * 30}, 100%, ${80 - localRatio * 10}%)`;
  } else {
    console.log('oha');
    // Orange to red (slowest levels)
    const localRatio = Math.min(1, (ratio - 0.8) / 0.2); // Clamp to 1
    return `hsl(${50 - localRatio * 30}, 100%, ${70 - localRatio * 10}%)`;
  }
};

export const LevelsBarChart: React.FC<LevelsBarChartProps> = ({
  levels,
  userPace,
  height = 300,
}) => {
  if (!levels || levels.length === 0) {
    return null;
  }

  // Sort levels by pace (fastest to slowest)
  const sortedLevels = [...levels].sort(
    (a, b) => a.expectedPace.quantity - b.expectedPace.quantity,
  );

  // Calculate pace range for positioning
  const fastestPace = sortedLevels[0]?.expectedPace.quantity || 0;
  const slowestPace = sortedLevels[sortedLevels.length - 1]?.expectedPace.quantity || 0;
  const paceRange = slowestPace - fastestPace;

  // Calculate user pace position (0-1, where 0 is top/fastest, 1 is bottom/slowest)
  const getUserPacePosition = (): number => {
    if (!userPace || paceRange === 0) return 0.5;

    const userPaceValue = userPace.quantity;

    // Clamp user pace within the range
    const clampedPace = Math.max(fastestPace, Math.min(slowestPace, userPaceValue));

    return (clampedPace - fastestPace) / paceRange;
  };

  const userPacePosition = getUserPacePosition();
  const userPacePixelPosition = userPacePosition * height;

  const segmentHeight = height / sortedLevels.length;

  return (
    <View style={[styles.container, { height }]}>
      {/* Level segments */}
      <View style={styles.barContainer}>
        {sortedLevels.map((level, index) => {
          const heatMapColor = getHeatMapColor(index, sortedLevels.length);
          console.log(
            `Level ${level.level} at index ${index}/${sortedLevels.length}: ${heatMapColor}`,
          );

          return (
            <View
              key={level.level}
              style={[
                styles.levelSegment,
                {
                  backgroundColor: heatMapColor,
                  height: segmentHeight,
                },
              ]}
            >
              <View style={styles.levelLabel}>
                <Text style={styles.levelName}>{level.level}</Text>
                <Text style={styles.levelPace}>{formatPace(level.expectedPace)}</Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* User pace indicator line */}
      {userPace && (
        <>
          <View
            style={[
              styles.paceIndicatorLine,
              {
                top: userPacePixelPosition - 1, // Center the 2px line
              },
            ]}
          />
          <View
            style={[
              styles.paceIndicatorLabel,
              {
                top: userPacePixelPosition - 12, // Position label above the line
              },
            ]}
          >
            <Text style={styles.paceIndicatorText}>Your Pace: {formatPace(userPace)}</Text>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  barContainer: {
    flex: 1,
    width: '100%',
  },
  levelSegment: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  levelLabel: {
    alignItems: 'flex-start',
  },
  levelName: {
    fontSize: 16,
    fontFamily: LatoFonts.bold,
    color: colors.background,
    marginBottom: 2,
  },
  levelPace: {
    fontSize: 12,
    fontFamily: LatoFonts.regular,
    color: colors.background,
    opacity: 0.9,
  },
  paceIndicatorLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: colors.background,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  paceIndicatorLabel: {
    position: 'absolute',
    right: 16,
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    zIndex: 11,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  paceIndicatorText: {
    fontSize: 12,
    fontFamily: LatoFonts.bold,
    color: colors.neutral,
  },
});
