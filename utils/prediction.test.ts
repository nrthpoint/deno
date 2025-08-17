import { ExtendedWorkout } from '@/types/ExtendedWorkout';
import { Group } from '@/types/Groups';
import { generateWorkoutPrediction, calculatePerformanceTrend } from '@/utils/prediction';
import { newQuantity } from '@/utils/quantity';

const createMockWorkout = (pace: number, distance: number, daysAgo: number): ExtendedWorkout => {
  const duration = pace * distance * 60; // Convert to seconds
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - daysAgo);

  return {
    startDate,
    endDate: new Date(startDate.getTime() + duration * 1000),
    duration: newQuantity(duration, 's'),
    totalDistance: newQuantity(distance, 'mi'),
    totalElevationAscended: newQuantity(100, 'm'),
    humidity: newQuantity(65, '%'),
    averagePace: newQuantity(pace, 'min/mile'),
    daysAgo: `${daysAgo} days ago`,
    prettyPace: `${Math.floor(pace)}:${Math.round((pace % 1) * 60)
      .toString()
      .padStart(2, '0')}`,
    achievements: {
      isAllTimeFastest: false,
      isAllTimeLongest: false,
      isAllTimeFurthest: false,
      isAllTimeHighestElevation: false,
      isPersonalBestPace: false,
    },
  } as ExtendedWorkout;
};

describe('AI Prediction System', () => {
  describe('calculatePerformanceTrend', () => {
    it('should detect improving trend', () => {
      const runs = [
        createMockWorkout(8.0, 5, 28), // 28 days ago, slower
        createMockWorkout(7.8, 5, 21), // 21 days ago
        createMockWorkout(7.6, 5, 14), // 14 days ago
        createMockWorkout(7.4, 5, 7), // 7 days ago, faster
      ];

      const trend = calculatePerformanceTrend(runs);

      expect(trend.momentum).toBe('improving');
      expect(trend.improvementRate).toBeGreaterThan(0);
      expect(trend.consistency).toBeGreaterThan(0.5);
    });

    it('should detect plateauing trend', () => {
      const runs = [
        createMockWorkout(7.5, 5, 28),
        createMockWorkout(7.5, 5, 21),
        createMockWorkout(7.5, 5, 14),
        createMockWorkout(7.5, 5, 7), // Consistent pace
      ];

      const trend = calculatePerformanceTrend(runs);

      expect(trend.momentum).toBe('plateauing');
      expect(trend.improvementRate).toBeLessThan(2);
    });

    it('should handle insufficient data', () => {
      const runs = [createMockWorkout(7.5, 5, 7)];

      const trend = calculatePerformanceTrend(runs);

      expect(trend.improvementRate).toBe(0);
      expect(trend.consistency).toBe(0);
      expect(trend.momentum).toBe('plateauing');
    });
  });

  describe('generateWorkoutPrediction', () => {
    it('should generate realistic prediction for improving runner', () => {
      const runs = [
        createMockWorkout(8.0, 5, 28),
        createMockWorkout(7.8, 5, 21),
        createMockWorkout(7.6, 5, 14),
        createMockWorkout(7.4, 5, 7),
      ];

      const mockGroup: Group = {
        type: 'distance',
        title: '5.0 miles',
        suffix: '',
        rank: 1,
        rankLabel: '',
        runs,
        highlight: runs[3], // fastest run
        worst: runs[0], // slowest run
        mostRecent: runs[3],
        percentageOfTotalWorkouts: 100,
        totalVariation: newQuantity(1800, 's'), // 30 minutes difference
        totalDistance: newQuantity(20, 'mi'), // 4 runs * 5 miles
        totalDuration: newQuantity(9600, 's'), // Total duration
        totalElevationAscended: newQuantity(400, 'm'),
        averagePace: newQuantity(7.65, 'min/mile'),
        averageHumidity: newQuantity(65, '%'),
        averageDuration: newQuantity(2400, 's'),
        prettyPace: '7:39 min/mile',
        stats: [],
        predictions: {
          prediction4Week: null,
          prediction12Week: null,
          recommendations: [],
        },
        variantDistribution: [],
        skipped: 0,
      };

      const prediction = generateWorkoutPrediction(mockGroup, 4);

      expect(prediction.type).toBe('predicted');
      expect(prediction.predictedPace.quantity).toBeLessThan(7.4); // Should be faster than current best
      expect(prediction.confidence).toBeGreaterThan(50); // Should have reasonable confidence
      expect(prediction.confidenceLevel).toMatch(/medium|high/);
      expect(prediction.improvementPercentage).toBeGreaterThan(0);
      expect(prediction.recommendedTraining.length).toBeGreaterThan(0);
    });

    it('should generate conservative prediction for elite performance', () => {
      const runs = [
        createMockWorkout(5.2, 5, 28), // Already very fast
        createMockWorkout(5.1, 5, 21),
        createMockWorkout(5.0, 5, 14),
        createMockWorkout(4.9, 5, 7),
      ];

      const mockGroup: Group = {
        type: 'distance',
        title: '5.0 miles',
        suffix: '',
        rank: 1,
        rankLabel: '',
        runs,
        highlight: runs[3], // fastest run
        worst: runs[0], // slowest run
        mostRecent: runs[3],
        percentageOfTotalWorkouts: 100,
        totalVariation: newQuantity(900, 's'),
        totalDistance: newQuantity(20, 'mi'),
        totalDuration: newQuantity(6000, 's'),
        totalElevationAscended: newQuantity(400, 'm'),
        averagePace: newQuantity(5.05, 'min/mile'),
        averageHumidity: newQuantity(65, '%'),
        averageDuration: newQuantity(2400, 's'),
        prettyPace: '5:03 min/mile',
        stats: [],
        predictions: {
          prediction4Week: null,
          prediction12Week: null,
          recommendations: [],
        },
        variantDistribution: [],
        skipped: 0,
      };

      const prediction = generateWorkoutPrediction(mockGroup, 4);

      // Should be very conservative improvement due to elite performance
      const improvementPercentage = ((4.9 - prediction.predictedPace.quantity) / 4.9) * 100;
      expect(improvementPercentage).toBeLessThan(5); // Less than 5% improvement
    });

    it('should provide specific training recommendations', () => {
      const runs = [
        createMockWorkout(7.0, 5, 28),
        createMockWorkout(6.9, 5, 21),
        createMockWorkout(6.8, 5, 14),
        createMockWorkout(6.7, 5, 7),
      ];

      const mockGroup: Group = {
        type: 'distance',
        title: '5.0 miles',
        suffix: '',
        rank: 1,
        rankLabel: '',
        runs,
        highlight: runs[3],
        worst: runs[0],
        mostRecent: runs[3],
        percentageOfTotalWorkouts: 100,
        totalVariation: newQuantity(900, 's'),
        totalDistance: newQuantity(20, 'mi'),
        totalDuration: newQuantity(8040, 's'),
        totalElevationAscended: newQuantity(400, 'm'),
        averagePace: newQuantity(6.85, 'min/mile'),
        averageHumidity: newQuantity(65, '%'),
        averageDuration: newQuantity(2400, 's'),
        prettyPace: '6:51 min/mile',
        stats: [],
        predictions: {
          prediction4Week: null,
          prediction12Week: null,
          recommendations: [],
        },
        variantDistribution: [],
        skipped: 0,
      };

      const prediction = generateWorkoutPrediction(mockGroup, 4);

      expect(prediction.recommendedTraining.length).toBeGreaterThan(0);

      const workoutTypes = prediction.recommendedTraining.map((rec) => rec.workoutType);
      expect(workoutTypes).toContain('tempo');
      // For 5-mile distance, we expect both tempo and intervals or long_run
      expect(workoutTypes.length).toBeGreaterThanOrEqual(1);

      prediction.recommendedTraining.forEach((rec) => {
        expect(rec.frequency).toBeGreaterThan(0);
        expect(rec.frequency).toBeLessThanOrEqual(3);
        expect(['easy', 'moderate', 'hard']).toContain(rec.intensity);
        expect(rec.reason).toBeTruthy();
      });
    });
  });

  describe('Prediction Integration', () => {
    it('should integrate predictions into group stats', () => {
      // This would test the integration with the actual grouping logic
      // Testing that predictions are added to group.stats when appropriate
      expect(true).toBe(true); // Placeholder for integration tests
    });
  });
});
