import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { AbstractChartConfig } from 'react-native-chart-kit/dist/AbstractChart';

import { colors } from '@/config/colors';
import { ExtendedWorkout } from '@/types/ExtendedWorkout';

interface PaceDistanceGraphProps {
  workouts: ExtendedWorkout[];
}

export const PaceDistanceGraph: React.FC<PaceDistanceGraphProps> = ({ workouts }) => {
  const [screenData, setScreenData] = useState(Dimensions.get('window'));

  useEffect(() => {
    const onChange = (result: { window: typeof screenData }) => {
      setScreenData(result.window);
    };

    const subscription = Dimensions.addEventListener('change', onChange);
    return () => subscription?.remove();
  }, []);

  const { width: screenWidth, height: screenHeight } = screenData;

  const chartWidth = screenWidth - 40;
  const chartHeight = Math.min(screenHeight - 180, 400);

  const chartData = workouts
    .filter((workout) => workout.totalDistance.quantity > 0 && workout.averagePace.quantity > 0)
    .map((workout) => ({
      distance: workout.totalDistance.quantity,
      pace: workout.averagePace.quantity, // This should be in minutes per mile
    }))
    .sort((a, b) => a.distance - b.distance);

  if (chartData.length === 0) {
    return (
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>No data available for pace vs distance</Text>
      </View>
    );
  }

  const distances = chartData.map((d) => d.distance);
  const paces = chartData.map((d) => d.pace);

  const data = {
    labels: distances.map((d) => d.toFixed(1)), // Show distance labels
    datasets: [
      {
        data: paces,
        color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`, // Pink line
        strokeWidth: 3,
      },
    ],
  };

  const chartConfig = {
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#ff6384',
      fill: '#ff6384',
    },
    propsForBackgroundLines: {
      strokeDasharray: '', // solid lines
      stroke: '#333333',
      strokeWidth: 1,
    },
    propsForLabels: {
      fontSize: 12,
    },
    backgroundGradientFrom: colors.surface,
    backgroundGradientFromOpacity: 1,
    backgroundGradientTo: colors.surface,
    backgroundGradientToOpacity: 1,
  } satisfies AbstractChartConfig;

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.container}>
        <LineChart
          data={data}
          width={Math.max(chartWidth, chartData.length * 60)} // Dynamic width based on data points and orientation
          height={chartHeight}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          fromZero={true}
          withInnerLines={true}
          withOuterLines={true}
          withVerticalLines={true}
          withHorizontalLines={true}
          withDots={true}
          //withShadow={false}
          formatXLabel={(value) => `${value} mi`}
          formatYLabel={(value) => `${value} min/mi`}
          yLabelsOffset={-10}
        />

        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#ff6384' }]} />
            <Text style={styles.legendText}>Average Pace</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colors.background,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: '#bbb',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    color: '#fff',
    fontSize: 14,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  noDataText: {
    color: '#bbb',
    fontSize: 16,
    textAlign: 'center',
  },
});
