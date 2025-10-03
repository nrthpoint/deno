import { Ionicons } from '@expo/vector-icons';
import { Quantity } from '@kingstinct/react-native-healthkit';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';

import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
import { formatDistance } from '@/utils/distance';
import { getAbsoluteDifference } from '@/utils/quantity';
import { subheading, uppercase } from '@/utils/text';
import { formatDuration } from '@/utils/time';

export interface ProgressionEntry {
  date: string;
  value: string;
  fullQuantity: Quantity;
  isImprovement: boolean;
}

interface ProgressionCardProps {
  title: string;
  description: string;
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

export const ProgressionCard: React.FC<ProgressionCardProps> = ({
  title,
  description,
  entries,
  metricLabel,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

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
      style={styles.tableRow}
    >
      <Text style={styles.cell}>{entry.date}</Text>
      <Text style={styles.cell}>{entry.value}</Text>
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

  const Header = () => (
    <TouchableOpacity
      style={styles.headerContainer}
      onPress={() => setIsExpanded(!isExpanded)}
      activeOpacity={0.7}
    >
      <View style={[styles.headerContent, isExpanded && styles.headerContentExpanded]}>
        <Text style={styles.title}>{title}</Text>
        <Ionicons
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={24}
          color="#FFFFFF"
          style={styles.chevronIcon}
        />
      </View>
      {isExpanded && <Text style={styles.description}>{description}</Text>}
    </TouchableOpacity>
  );

  const TableHeader = () => (
    <View style={styles.tableHeader}>
      <View style={styles.spacerCell}></View>
      <Text style={styles.headerCell}>{metricLabel}</Text>
      <Text style={styles.headerCell}>Difference</Text>
    </View>
  );

  const Content = () =>
    entries.length === 0 ? (
      <NoData />
    ) : (
      <View style={styles.tableContainer}>
        <TableHeader />

        <View style={styles.table}>
          {entries.map((entry, index) => (
            <Row
              key={index}
              entry={entry}
              previousEntry={entries[index + 1]}
              index={index}
            />
          ))}
        </View>
      </View>
    );

  return (
    <View style={styles.container}>
      <Header />
      {isExpanded && <Content />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 5,
  },
  headerContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 15,
  },
  headerContentExpanded: {
    paddingBottom: 0,
  },
  title: {
    ...subheading,
    marginTop: 0,
    marginBottom: 0,
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: LatoFonts.bold,
    textAlign: 'left',
    flex: 1,
  },
  chevronIcon: {
    marginLeft: 10,
  },
  description: {
    color: '#CCCCCC',
    fontSize: 14,
    fontFamily: LatoFonts.regular,
    marginTop: 5,
    marginBottom: 15,
    textAlign: 'left',
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
    backgroundColor: colors.surface,
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  spacerCell: {
    flex: 1,
  },
  headerCell: {
    ...uppercase,
    flex: 1,
    color: '#CCCCCC',
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
});
