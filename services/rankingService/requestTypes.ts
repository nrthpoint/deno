import { LengthUnit } from '@kingstinct/react-native-healthkit';

// Request payload for fetching ranking data
export interface RankingRequest {
  age: number;
  distance: number;
  unit: LengthUnit;
  time: number; // in seconds
  gender: 'Male' | 'Female' | 'Other';
}

export interface GetLevelsRequest {
  distance: number;
  unit: LengthUnit;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
}
