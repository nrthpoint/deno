import { LengthUnit } from '@kingstinct/react-native-healthkit';

// Request payload for fetching ranking data
export interface RankingRequest {
  age: number | null;
  distance: number;
  unit: LengthUnit;
  time: number; // in seconds
  gender: 'Male' | 'Female' | 'Other' | null;
}

export interface GetLevelsRequest {
  distance: number;
  unit: LengthUnit;
  age: number | null;
  gender: 'Male' | 'Female' | 'Other' | null;
}
