import { useMemo } from 'react';

import { Groups } from '@/types/Groups';
import { PredictedWorkout } from '@/types/Prediction';
import { generateWorkoutPrediction } from '@/utils/prediction';

/**
 * Hook to generate AI-powered performance predictions for workout groups
 */
export const usePredictivePersonalBest = (
  groups: Groups,
  targetWeeksAhead: number = 4,
): Record<string, PredictedWorkout> => {
  return useMemo(() => {
    const predictions: Record<string, PredictedWorkout> = {};

    Object.entries(groups).forEach(([groupKey, group]) => {
      // Only generate predictions for groups with enough data
      if (group.runs.length >= 2) {
        try {
          predictions[groupKey] = generateWorkoutPrediction(group, targetWeeksAhead);
        } catch (error) {
          console.warn(`Failed to generate prediction for group ${groupKey}:`, error);
        }
      }
    });

    return predictions;
  }, [groups, targetWeeksAhead]);
};

/**
 * Get the best prediction (highest confidence) from a set of predictions
 */
export const getBestPrediction = (
  predictions: Record<string, PredictedWorkout>,
): PredictedWorkout | null => {
  const predictionList = Object.values(predictions);
  if (predictionList.length === 0) return null;

  return predictionList.reduce((best, current) =>
    current.confidence > best.confidence ? current : best,
  );
};

/**
 * Filter predictions by confidence level
 */
export const filterPredictionsByConfidence = (
  predictions: Record<string, PredictedWorkout>,
  minConfidence: 'low' | 'medium' | 'high',
): Record<string, PredictedWorkout> => {
  const confidenceThresholds = {
    low: 0,
    medium: 40,
    high: 70,
  };

  const threshold = confidenceThresholds[minConfidence];

  return Object.fromEntries(
    Object.entries(predictions).filter(([_, prediction]) => prediction.confidence >= threshold),
  );
};

/**
 * Get training recommendations from all predictions
 */
export const getAllTrainingRecommendations = (predictions: Record<string, PredictedWorkout>) => {
  const allRecommendations = Object.values(predictions).flatMap(
    (prediction) => prediction.recommendedTraining,
  );

  // Aggregate by workout type
  const aggregated = allRecommendations.reduce(
    (acc, rec) => {
      if (!acc[rec.workoutType]) {
        acc[rec.workoutType] = {
          ...rec,
          frequency: 0,
          sources: [],
        };
      }

      acc[rec.workoutType].frequency += rec.frequency;
      acc[rec.workoutType].sources.push(rec.reason);

      return acc;
    },
    {} as Record<
      string,
      {
        workoutType: string;
        frequency: number;
        intensity: string;
        reason: string;
        sources: string[];
      }
    >,
  );

  return Object.values(aggregated);
};
