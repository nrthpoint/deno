import { Quantity } from '@kingstinct/react-native-healthkit';

// Processed Level Data with Quantity types
export interface Levels {
  distance: number;
  unit: 'mile' | 'km';
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  levels: Level[];
}

export interface Level {
  level: string;
  expectedPace: Quantity;
  expectedTime: Quantity;
  ageRange: string;
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
