import { Quantity } from '@kingstinct/react-native-healthkit';
import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
import { formatDistance } from '@/utils/distance';
import { getAbsoluteDifference } from '@/utils/quantity';
import { uppercase } from '@/utils/text';
import { formatDuration } from '@/utils/time';

export interface ProgressionEntry {
  date: string;
  value: string;
  fullQuantity: Quantity;
  isImprovement: boolean;
  isPredicted?: boolean;
  distance?: Quantity;
}

interface ProgressionCardProps {
  entries: ProgressionEntry[];
  metricLabel: string;
}

const calculateDifference = (current: Quantity, previous?: Quantity): string => {
  if (!previous) return '—';

  const diff = getAbsoluteDifference(previous, current);

  // TODO: Handle other units like "min/mi" or "min/km"
  const formattedDiff = diff.unit === 's' ? formatDuration(diff) : formatDistance(diff);

  if (diff.quantity === 0) return '—';

  return formattedDiff;
};

export const ProgressionCard: React.FC<ProgressionCardProps> = ({ entries, metricLabel }) => {
  const [showPredicted, setShowPredicted] = useState(true);
  const legendOpacity = useSharedValue(1);

  const filteredEntries = showPredicted ? entries : entries.filter((entry) => !entry.isPredicted);

  const togglePredicted = () => {
    const newShowPredicted = !showPredicted;
    setShowPredicted(newShowPredicted);

    // Animate legend opacity based on showPredicted state
    legendOpacity.value = withTiming(newShowPredicted ? 1 : 0.3, { duration: 300 });
  };

  const legendAnimatedStyle = useAnimatedStyle(() => ({
    opacity: legendOpacity.value,
  }));

  const NoData = () => (
    <View style={styles.noDataContainerWrapper}>
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>Not enough data to show progression</Text>
      </View>
    </View>
  );

  const NoChangeIndicator = () => <Text style={[styles.cell, styles.noChangeText]}>—</Text>;

  const LatestEntryChange = ({
    currentQuantity,
    previousQuantity,
  }: {
    currentQuantity: Quantity;
    previousQuantity?: Quantity;
  }) => (
    <View style={styles.latestContainer}>
      <Text style={[styles.cell, styles.differenceText]}>
        {calculateDifference(currentQuantity, previousQuantity)}
      </Text>
    </View>
  );

  const HistoricalEntryChange = ({
    currentQuantity,
    previousQuantity,
    isImprovement,
  }: {
    currentQuantity: Quantity;
    previousQuantity?: Quantity;
    isImprovement: boolean;
  }) => (
    <Text
      style={[styles.cell, styles.differenceText, { color: isImprovement ? '#4CAF50' : '#f32121' }]}
    >
      {calculateDifference(currentQuantity, previousQuantity)}
    </Text>
  );

  const Row = ({
    entry,
    previousEntry,
    index,
  }: {
    entry: ProgressionEntry;
    previousEntry?: ProgressionEntry;
    index: number;
  }) => (
    <View
      key={index}
      style={[styles.tableRow, entry.isPredicted && styles.predictedRow]}
    >
      <Text style={[styles.cell, entry.isPredicted && styles.predictedText]}>
        {entry.isPredicted ? `${entry.date}` : entry.date}
      </Text>

      <Text style={[styles.cell, entry.isPredicted && styles.predictedText]}>{entry.value}</Text>

      <Text style={[styles.cell, entry.isPredicted && styles.predictedText]}>
        {entry.distance ? formatDistance(entry.distance) : '—'}
      </Text>

      <View style={styles.changeCell}>
        {index === entries.length - 1 ? (
          <NoChangeIndicator />
        ) : index === 0 ? (
          <LatestEntryChange
            currentQuantity={entry.fullQuantity}
            previousQuantity={previousEntry?.fullQuantity}
          />
        ) : (
          <HistoricalEntryChange
            currentQuantity={entry.fullQuantity}
            previousQuantity={previousEntry?.fullQuantity}
            isImprovement={entry.isImprovement}
          />
        )}
      </View>
    </View>
  );

  const TableHeader = () => (
    <View style={styles.tableHeader}>
      <View style={styles.spacerCell}></View>
      <Text style={styles.headerCell}>{metricLabel}</Text>
      <Text style={styles.headerCell}>Distance</Text>
      <Text style={styles.headerCell}>Difference</Text>
    </View>
  );

  const Legend = () => (
    <TouchableOpacity
      onPress={togglePredicted}
      activeOpacity={0.7}
    >
      <Animated.View style={[styles.legendContainer, legendAnimatedStyle]}>
        <View style={styles.legendItem}>
          <View style={styles.legendSquare} />
          <Text style={styles.legendText}>Predicted</Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );

  const Content = () =>
    entries.length === 0 ? (
      <NoData />
    ) : (
      <View style={styles.tableContainer}>
        <TableHeader />

        <View style={styles.table}>
          {filteredEntries.map((entry, index) => (
            <Row
              key={index}
              entry={entry}
              previousEntry={filteredEntries[index + 1]}
              index={index}
            />
          ))}
        </View>

        <Legend />
      </View>
    );

  return (
    <View style={styles.container}>
      <Content />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 5,
  },
  noDataContainerWrapper: {
    paddingBottom: 15,
  },
  noDataContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  noDataText: {
    color: '#999999',
    fontSize: 14,
    fontFamily: LatoFonts.italic,
    fontStyle: 'italic',
  },
  tableContainer: {
    paddingBottom: 15,
  },
  table: {
    overflow: 'hidden',
    marginBottom: 5,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  spacerCell: {
    flex: 1,
  },
  headerCell: {
    ...uppercase,
    flex: 1,
    color: '#FFF',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface,
  },
  cell: {
    ...uppercase,
    color: '#FFF',
    flex: 1,
    fontFamily: LatoFonts.bold,
    textAlign: 'center',
  },
  changeCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  differenceText: {
    fontFamily: LatoFonts.bold,
    fontSize: 12,
    color: '#11db18',
  },
  latestContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noChangeText: {
    marginTop: 6,
    color: '#666666',
  },
  predictedRow: {
    backgroundColor: 'rgba(74, 175, 79, 0.1)',
    borderLeftWidth: 3,
    borderLeftColor: '#4CAF50',
  },
  predictedText: {
    fontStyle: 'italic',
    color: '#4CAF50',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 5,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendSquare: {
    width: 12,
    height: 12,
    backgroundColor: '#4CAF50',
    marginRight: 6,
  },
  legendText: {
    ...uppercase,
    color: '#CCCCCC',
    fontSize: 12,
    fontFamily: LatoFonts.regular,
  },
});
