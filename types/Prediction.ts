import { Quantity } from '@kingstinct/react-native-healthkit';

export type PredictionConfidence = 'low' | 'medium' | 'high';

export type PredictedWorkout = {
  type: 'predicted';
  groupKey: string;
  targetDate: Date;
  predictedPace: Quantity;
  predictedDuration: Quantity;
  predictedDistance?: Quantity;
  confidence: number;
  confidenceLevel: PredictionConfidence;
  improvementPercentage: number;
  predictionBasis: {
    dataPoints: number;
    timeSpanDays: number;
    trendStrength: number;
    consistencyScore: number;
  };
};

export type PerformanceTrend = {
  improvementRate: number; // percentage per week
  consistency: number; // 0-1 score
  momentum: 'improving' | 'plateauing' | 'declining';
  volatility: number; // standard deviation of pace variations
};
