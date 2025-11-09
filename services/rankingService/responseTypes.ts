// Response structure for ranking data
export interface RawRankingResponse {
  distance: number;
  distanceLabel: string;
  unit: string;
  level: 'Beginner' | 'Novice' | 'Intermediate' | 'Advanced' | 'Elite' | 'WR';
  rank: number;
  percentile: number;
  betterThanPercent: number;
  averagePace: number;
  yourPace: number;
  yourTime: string;
  averageTime: string;
  distanceDiff: number;
}

export interface RawLevelData {
  level: string;
  expectedPace: number; // in seconds per unit
  expectedTime: string; // formatted time string
  ageRange: string;
}

export interface RawLevelsResponse {
  distance: number;
  unit: string;
  levels: RawLevelData[];
}
