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
  const [tooltipPos, setTooltipPos] = useState<{
    x: number;
    y: number;
    visible: boolean;
    value: string;
    label: string;
  }>({
    x: 0,
    y: 0,
    visible: false,
    value: '',
    label: '',
  });

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

  const filteredWorkouts = workouts
    .filter((workout) => workout.distance.quantity > 0 && workout.pace.quantity > 0)
    .map((workout) => ({
      distance: workout.distance.quantity,
      pace: workout.pace.quantity, // This should be in minutes per mile
    }));

  // Group by whole distance units and average the pace
  const groupedData = new Map<number, number[]>();

  filteredWorkouts.forEach(({ distance, pace }) => {
    const roundedDistance = Math.round(distance);
    if (!groupedData.has(roundedDistance)) {
      groupedData.set(roundedDistance, []);
    }
    groupedData.get(roundedDistance)!.push(pace);
  });

  // Calculate average pace for each distance group
  const chartData = Array.from(groupedData.entries())
    .map(([distance, paces]) => ({
      distance,
      pace: paces.reduce((sum, pace) => sum + pace, 0) / paces.length,
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

  const handleDataPointClick = (data: any) => {
    const dataPointIndex = data.index;
    const distance = distances[dataPointIndex];
    const pace = paces[dataPointIndex];
    const workoutCount = groupedData.get(distance)?.length || 0;

    setTooltipPos((prev) => ({
      x: data.x,
      y: data.y,
      visible: !prev.visible,
      value: `${parseFloat(pace.toString()) % 1 === 0 ? parseInt(pace.toString()) : parseFloat(pace.toString()).toFixed(1)} min/mi`,
      label: `${distance} mi • ${workoutCount} workout${workoutCount !== 1 ? 's' : ''}`,
    }));
  };

  const data = {
    labels: distances.map((d) => d.toString()), // Show whole distance labels
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
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
    >
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
          formatYLabel={(value) =>
            `${parseFloat(value) % 1 === 0 ? parseInt(value) : parseFloat(value)} min/mi`
          }
          yLabelsOffset={-10}
          onDataPointClick={handleDataPointClick}
        />

        {tooltipPos.visible && (
          <View
            style={[
              styles.tooltip,
              {
                left: tooltipPos.x - 60,
                top: tooltipPos.y - 70,
              },
            ]}
          >
            <Text style={styles.tooltipLabel}>{tooltipPos.label}</Text>
            <Text style={styles.tooltipValue}>{tooltipPos.value}</Text>
          </View>
        )}

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
  tooltip: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tooltipLabel: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
  },
  tooltipValue: {
    color: '#ff6384',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
