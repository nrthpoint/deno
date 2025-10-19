// Response structure for ranking data
export interface RawRankingResponse {
  level: 'Beginner' | 'Novice' | 'Intermediate' | 'Advanced' | 'Elite' | 'WR';
  rank: number;
  percentile: number;
  totalAthletes: number;
  yourTime: string;
  averageTime: string;
  yourPace: number;
  averagePace: number;
  betterThanPercent: number;
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
