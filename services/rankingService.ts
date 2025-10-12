export interface RankingRequest {
  age: number;
  distance: number;
  unit: 'mile' | 'km';
  time: number; // in seconds
  gender: 'Male' | 'Female' | 'Other';
}

export interface RankingResponse {
  level: string;
  rank: number;
  percentile: number;
  total_athletes: number;
  your_time: string;
  average_time: string;
  your_pace: number;
  average_pace: number;
  better_than_percent: number;
}

export interface LevelData {
  level: string;
  minTime: number;
  maxTime: number;
  minPace: number;
  maxPace: number;
}

export interface LevelsResponse {
  distance: number;
  unit: string;
  levels: LevelData[];
}

const BASE_URL = process.env.EXPO_PUBLIC_RANKING_API_BASE_URL || 'https://api.deno.fit';

export const rankingService = {
  async getRanking(request: RankingRequest): Promise<RankingResponse> {
    const response = await fetch(`${BASE_URL}/ranking`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ranking: ${response.statusText}`);
    }

    return response.json();
  },

  async getLevels(distance: number, unit: 'mile' | 'km' = 'mile'): Promise<LevelsResponse> {
    const response = await fetch(`${BASE_URL}/levels?distance=${distance}&unit=${unit}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch levels: ${response.statusText}`);
    }

    return response.json();
  },
};

export const getLevelColor = (level: string): string => {
  switch (level.toLowerCase()) {
    case 'elite':
      return '#FFD700'; // Gold
    case 'sub-elite':
      return '#C0C0C0'; // Silver
    case 'competitive':
      return '#CD7F32'; // Bronze
    case 'recreational':
      return '#4CAF50'; // Green
    case 'beginner':
      return '#2196F3'; // Blue
    default:
      return '#9E9E9E'; // Gray
  }
};

export const getLevelIntensity = (level: string): number => {
  switch (level.toLowerCase()) {
    case 'elite':
      return 1.0;
    case 'sub-elite':
      return 0.8;
    case 'competitive':
      return 0.6;
    case 'recreational':
      return 0.4;
    case 'beginner':
      return 0.2;
    default:
      return 0.1;
  }
};
