import { addWeeks, differenceInDays } from 'date-fns';

import { ExtendedWorkout } from '@/types/ExtendedWorkout';
import { Group } from '@/types/Groups';
import {
  PredictedWorkout,
  PerformanceTrend,
  TrainingRecommendation,
  PredictionConfidence,
} from '@/types/Prediction';
import { newQuantity } from '@/utils/quantity';

/**
 * Calculate improvement trend based on historical performance data
 */
export const calculatePerformanceTrend = (runs: ExtendedWorkout[]): PerformanceTrend => {
  if (runs.length < 2) {
    return {
      improvementRate: 0,
      consistency: 0,
      momentum: 'plateauing',
      volatility: 0,
    };
  }

  // Sort runs by date (oldest first)
  const sortedRuns = [...runs].sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

  // Calculate pace improvements over time
  const paceData = sortedRuns.map((run, index) => ({
    daysSinceFirst: differenceInDays(run.startDate, sortedRuns[0].startDate),
    pace: run.averagePace.quantity,
    index,
  }));

  // Calculate linear regression for improvement trend
  const { slope, r2 } = calculateLinearRegression(paceData);

  // Convert slope to weekly improvement rate (negative slope = improvement in pace)
  const weeklyImprovementRate = (Math.abs(slope * 7) / paceData[0].pace) * 100;

  // Calculate consistency (based on R-squared)
  const consistency = Math.max(0, r2);

  // Calculate volatility (standard deviation of pace)
  const paces = paceData.map((d) => d.pace);
  const meanPace = paces.reduce((sum, pace) => sum + pace, 0) / paces.length;
  const volatility = Math.sqrt(
    paces.reduce((sum, pace) => sum + Math.pow(pace - meanPace, 2), 0) / paces.length,
  );

  // Determine momentum based on recent trend (last 30% of workouts)
  const recentCount = Math.max(2, Math.floor(sortedRuns.length * 0.3));
  const recentRuns = sortedRuns.slice(-recentCount);
  const recentSlope = calculateRecentTrend(recentRuns);

  let momentum: PerformanceTrend['momentum'] = 'plateauing';

  if (recentSlope < -0.01) {
    momentum = 'improving'; // Getting faster
  } else if (recentSlope > 0.01) {
    momentum = 'declining'; // Getting slower
  }

  return {
    improvementRate: weeklyImprovementRate,
    consistency,
    momentum,
    volatility: (volatility / meanPace) * 100, // As percentage
  };
};

/**
 * Calculate linear regression for trend analysis
 */
const calculateLinearRegression = (data: { daysSinceFirst: number; pace: number }[]) => {
  const n = data.length;

  // Handle edge case: insufficient data
  if (n < 2) {
    console.log('Linear Regression: Insufficient data points');
    const meanY = n > 0 ? data[0].pace : 0;
    return { slope: 0, intercept: meanY, r2: 0 };
  }

  const sumX = data.reduce((sum, d) => sum + d.daysSinceFirst, 0);
  const sumY = data.reduce((sum, d) => sum + d.pace, 0);
  const sumXY = data.reduce((sum, d) => sum + d.daysSinceFirst * d.pace, 0);
  const sumX2 = data.reduce((sum, d) => sum + d.daysSinceFirst * d.daysSinceFirst, 0);

  // Check for division by zero (all points have same x-value)
  const denominator = n * sumX2 - sumX * sumX;

  if (denominator === 0) {
    // All data points have the same daysSinceFirst value (same day)
    // Return zero slope (no trend) and mean pace as intercept
    console.log('Linear Regression: No x-variation detected, returning zero slope');

    const meanY = sumY / n;
    return { slope: 0, intercept: meanY, r2: 0 };
  }

  const slope = (n * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / n;

  // Calculate R-squared with safety checks
  const yMean = sumY / n;
  const ssTotal = data.reduce((sum, d) => sum + Math.pow(d.pace - yMean, 2), 0);
  const ssResidual = data.reduce((sum, d) => {
    const predicted = slope * d.daysSinceFirst + intercept;

    return sum + Math.pow(d.pace - predicted, 2);
  }, 0);

  // Prevent NaN in R² calculation
  let r2 = 0;
  if (ssTotal > 0 && !isNaN(ssResidual)) {
    r2 = 1 - ssResidual / ssTotal;
    // Ensure R² is between 0 and 1
    r2 = Math.max(0, Math.min(1, r2));
  }

  return { slope, intercept, r2 };
};

/**
 * Calculate recent trend for momentum analysis
 */
const calculateRecentTrend = (recentRuns: ExtendedWorkout[]): number => {
  if (recentRuns.length < 2) return 0;

  const firstPace = recentRuns[0].averagePace.quantity;
  const lastPace = recentRuns[recentRuns.length - 1].averagePace.quantity;
  const daysDiff = differenceInDays(
    recentRuns[recentRuns.length - 1].startDate,
    recentRuns[0].startDate,
  );

  if (daysDiff === 0) return 0;

  return (lastPace - firstPace) / daysDiff; // Positive = getting slower
};

/**
 * Calculate realism factor to prevent unrealistic predictions
 */
export const calculateRealismFactor = (currentBest: ExtendedWorkout): number => {
  const currentPace = currentBest.averagePace.quantity;

  // Elite performance benchmarks (min/mi)
  const eliteBenchmarks = {
    '1.0': 4.5, // 1 mile
    '3.1': 5.0, // 5K
    '5.0': 5.2, // 5 mile
    '6.2': 5.4, // 10K
    '13.1': 5.8, // Half marathon
    '26.2': 6.2, // Marathon
  };

  // Find closest distance benchmark
  const distances = Object.keys(eliteBenchmarks).map(Number);
  const currentDistance = currentBest.totalDistance.quantity;
  const closestDistance = distances.reduce((prev, curr) =>
    Math.abs(curr - currentDistance) < Math.abs(prev - currentDistance) ? curr : prev,
  );

  const elitePace =
    eliteBenchmarks[closestDistance.toString() as keyof typeof eliteBenchmarks] || 5.0;

  // Calculate how close we are to elite performance
  const eliteGap = currentPace - elitePace;

  // Apply diminishing returns as we approach elite level
  if (eliteGap < 1.0) {
    // Very close to elite
    return 0.2;
  } else if (eliteGap < 2.0) {
    // Close to elite
    return 0.5;
  } else if (eliteGap < 3.0) {
    // Good performance
    return 0.8;
  } else {
    return 1.0; // Plenty of room for improvement
  }
};

/**
 * Calculate prediction confidence based on data quality
 */
export const calculatePredictionConfidence = (
  group: Group,
  trend: PerformanceTrend,
): { score: number; level: PredictionConfidence } => {
  let score = 0;

  // Data volume factor (0-30 points)
  const dataVolumeScore = Math.min(30, group.runs.length * 3);
  score += dataVolumeScore;

  // Consistency factor (0-25 points)
  const consistencyScore = trend.consistency * 25;
  score += consistencyScore;

  // Time span factor (0-20 points)
  const timeSpanDays = differenceInDays(group.mostRecent.startDate, group.runs[0].startDate);
  const timeSpanScore = Math.min(20, timeSpanDays / 7); // 1 point per week, max 20
  score += timeSpanScore;

  // Momentum factor (0-15 points)
  const momentumScore =
    trend.momentum === 'improving' ? 15 : trend.momentum === 'plateauing' ? 8 : 0;
  score += momentumScore;

  // Volatility penalty (0-10 points deducted)
  const volatilityPenalty = Math.min(10, trend.volatility / 2);
  score -= volatilityPenalty;

  // Ensure score is between 0-100
  score = Math.max(0, Math.min(100, score));

  let level: PredictionConfidence;
  if (score >= 70) level = 'high';
  else if (score >= 40) level = 'medium';
  else level = 'low';

  return { score, level };
};

/**
 * Generate training recommendations based on performance analysis
 */
export const generateTrainingRecommendations = (
  group: Group,
  trend: PerformanceTrend,
  targetImprovementRate: number,
): TrainingRecommendation[] => {
  const recommendations: TrainingRecommendation[] = [];
  const currentPace = group.highlight.averagePace.quantity;
  const groupDistance = group.highlight.totalDistance.quantity;

  // Base recommendations on group type and current performance
  if (groupDistance <= 5) {
    // Short distance focus
    if (trend.momentum !== 'improving' || targetImprovementRate > 3) {
      recommendations.push({
        workoutType: 'intervals',
        frequency: 2,
        intensity: 'hard',
        reason: 'Improve speed and VO2 max for shorter distances',
        duration: newQuantity(30, 'min'),
        targetPace: newQuantity(currentPace * 0.9, 'min/mi'),
      });
    }

    recommendations.push({
      workoutType: 'tempo',
      frequency: 1,
      intensity: 'moderate',
      reason: 'Build lactate threshold for sustained speed',
      duration: newQuantity(20, 'min'),
      targetPace: newQuantity(currentPace * 0.95, 'min/mi'),
    });
  } else if (groupDistance <= 13) {
    // Medium distance focus
    recommendations.push({
      workoutType: 'tempo',
      frequency: 2,
      intensity: 'moderate',
      reason: 'Improve aerobic capacity and race pace',
      duration: newQuantity(30, 'min'),
      targetPace: newQuantity(currentPace * 0.95, 'min/mi'),
    });

    recommendations.push({
      workoutType: 'long_run',
      frequency: 1,
      intensity: 'easy',
      reason: 'Build aerobic base and endurance',
      duration: newQuantity(60, 'min'),
      targetPace: newQuantity(currentPace * 1.1, 'min/mi'),
    });
  } else {
    // Long distance focus
    recommendations.push({
      workoutType: 'long_run',
      frequency: 1,
      intensity: 'easy',
      reason: 'Essential for marathon/ultra endurance',
      duration: newQuantity(90, 'min'),
      targetPace: newQuantity(currentPace * 1.15, 'min/mi'),
    });

    recommendations.push({
      workoutType: 'tempo',
      frequency: 1,
      intensity: 'moderate',
      reason: 'Maintain speed while building endurance',
      duration: newQuantity(40, 'min'),
      targetPace: newQuantity(currentPace * 0.98, 'min/mi'),
    });
  }

  // Add recovery based on volatility
  if (trend.volatility > 10) {
    recommendations.push({
      workoutType: 'recovery',
      frequency: 2,
      intensity: 'easy',
      reason: 'High performance variability suggests need for more recovery',
      duration: newQuantity(30, 'min'),
      targetPace: newQuantity(currentPace * 1.2, 'min/mi'),
    });
  }

  // Add hill training for plateau breaking
  if (trend.momentum === 'plateauing') {
    recommendations.push({
      workoutType: 'hill_training',
      frequency: 1,
      intensity: 'hard',
      reason: 'Break through performance plateau with strength training',
      duration: newQuantity(25, 'min'),
    });
  }

  return recommendations.slice(0, 4); // Limit to 4 recommendations
};

/**
 * Generate workout prediction for a specific group
 */
export const generateWorkoutPrediction = (
  group: Group,
  weeksAhead: number = 4,
): PredictedWorkout => {
  const trend = calculatePerformanceTrend(group.runs);
  const confidence = calculatePredictionConfidence(group, trend);

  // Calculate realistic improvement
  const realismFactor = calculateRealismFactor(group.highlight);
  const adjustedImprovementRate = trend.improvementRate * realismFactor;

  // Apply improvement over time with diminishing returns
  const totalImprovementWeeks = weeksAhead;
  const totalImprovement =
    adjustedImprovementRate * totalImprovementWeeks * (confidence.score / 100);

  // Calculate predicted pace (improvement means lower pace value)
  const currentPace = group.highlight.averagePace.quantity;
  const predictedPaceReduction = currentPace * (totalImprovement / 100);
  const predictedPace = Math.max(currentPace - predictedPaceReduction, currentPace * 0.85); // Cap at 15% improvement

  // Calculate predicted duration for the same distance
  const distance = group.highlight.totalDistance.quantity;
  const predictedDurationMinutes = predictedPace * distance;
  const predictedDuration = predictedDurationMinutes * 60; // Convert to seconds

  // Generate training recommendations
  const recommendations = generateTrainingRecommendations(group, trend, totalImprovement);

  const timeSpanDays =
    group.runs.length > 1
      ? differenceInDays(group.mostRecent.startDate, group.runs[0].startDate)
      : 0;

  return {
    type: 'predicted',
    groupKey: group.title,
    targetDate: addWeeks(new Date(), weeksAhead),
    predictedPace: newQuantity(Number(predictedPace.toFixed(2)), group.highlight.averagePace.unit),
    predictedDuration: newQuantity(Number(predictedDuration.toFixed(2)), 's'),
    predictedDistance: group.highlight.totalDistance,
    confidence: Number(confidence.score.toFixed(2)),
    confidenceLevel: confidence.level,
    improvementPercentage: Number(totalImprovement.toFixed(2)),
    recommendedTraining: recommendations,
    predictionBasis: {
      dataPoints: group.runs.length,
      timeSpanDays,
      trendStrength: Number(trend.consistency.toFixed(2)),
      consistencyScore: Number((trend.consistency * 100).toFixed(2)),
    },
  };
};
