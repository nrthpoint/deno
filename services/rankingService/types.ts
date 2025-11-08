import { LengthUnit, Quantity } from '@kingstinct/react-native-healthkit';

// Processed Level Data with Quantity types
export interface Levels {
  distance: number;
  unit: LengthUnit;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  levels: Level[];
}

export interface Level {
  level: string;
  expectedPace: Quantity;
  expectedTime: Quantity;
}

export interface Ranking {
  level: string;
  rank: number;
  percentile: number;
  totalAthletes: number;
  yourTime: Quantity;
  averageTime: Quantity;
  yourPace: Quantity;
  averagePace: Quantity;
  betterThanPercent: number;
}
