// Request payload for fetching ranking data
export interface RankingRequest {
  age: number;
  distance: number;
  unit: 'mile' | 'km';
  time: number; // in seconds
  gender: 'Male' | 'Female' | 'Other';
}

export interface GetLevelsRequest {
  distance: number;
  unit: 'mile' | 'km';
  age: number;
  gender: 'Male' | 'Female' | 'Other';
}
