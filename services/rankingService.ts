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
  totalAthletes: number;
  yourTime: string;
  averageTime: string;
  yourPace: number;
  averagePace: number;
  betterThanPercent: number;
}

export interface LevelData {
  level: string;
  expectedPace: number; // in seconds per unit
  expectedTime: string; // formatted time string
  ageRange: string;
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
      return '#FF6B35'; // Vibrant Orange-Red
    case 'advanced':
      return '#F7931E'; // Bright Orange
    case 'intermediate':
      return '#FFD23F'; // Bright Yellow
    case 'beginner':
      return '#06FFA5'; // Bright Mint Green
    // Legacy support for old level names
    case 'sub-elite':
      return '#C0C0C0'; // Silver
    case 'competitive':
      return '#CD7F32'; // Bronze
    case 'recreational':
      return '#4CAF50'; // Green
    default:
      return '#9E9E9E'; // Gray
  }
};

export const getLevelIntensity = (level: string): number => {
  switch (level.toLowerCase()) {
    case 'elite':
      return 0.9; // High intensity for vibrant orange-red
    case 'advanced':
      return 0.8; // High intensity for bright orange
    case 'intermediate':
      return 0.7; // Good intensity for bright yellow
    case 'beginner':
      return 0.8; // High intensity for bright mint green
    // Legacy support for old level names
    case 'sub-elite':
      return 0.8;
    case 'competitive':
      return 0.6;
    case 'recreational':
      return 0.4;
    default:
      return 0.1;
  }
};
