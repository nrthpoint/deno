import { Quantity } from '@kingstinct/react-native-healthkit';

export type PredictionConfidence = 'low' | 'medium' | 'high';

export type TrainingRecommendation = {
  workoutType: 'tempo' | 'intervals' | 'long_run' | 'recovery' | 'speed_work' | 'hill_training';
  frequency: number; // per week
  intensity: 'easy' | 'moderate' | 'hard';
  reason: string;
  duration?: Quantity;
  targetPace?: Quantity;
};

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
  recommendedTraining: TrainingRecommendation[];
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

export type PredictionAccuracy = {
  predictionId: string;
  predictedValue: Quantity;
  actualValue: Quantity;
  accuracyPercentage: number;
  predictionDate: Date;
  actualDate: Date;
};
