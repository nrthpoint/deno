export interface RankingRequest {
  age: number;
  distance: number;
  unit: 'mile' | 'km';
  time: number; // in seconds
  gender: 'Male' | 'Female' | 'Other';
}

export interface RankingResponse {
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

export interface GetLevelsRequest {
  distance: number;
  unit: 'mile' | 'km';
  age: number;
  gender: 'Male' | 'Female' | 'Other';
}

const BASE_URL = process.env.EXPO_PUBLIC_RANKING_API_BASE_URL || 'https://api.deno.fit';

const fetchRanking = async (request: RankingRequest): Promise<RankingResponse> => {
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
};

const fetchLevels = async ({
  distance,
  unit,
  age,
  gender,
}: GetLevelsRequest): Promise<LevelsResponse> => {
  const response = await fetch(
    `${BASE_URL}/levels?distance=${distance}&unit=${unit}&age=${age}&gender=${gender}`,
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Failed to fetch levels: ${data.message}`);
  }

  return data;
};

export const rankingService = {
  getRanking: fetchRanking,
  getLevels: fetchLevels,
};

export const getLevelColor = (level: string): string => {
  switch (level.toLowerCase()) {
    case 'wr':
      return '#FF0080'; // Bright Magenta/Pink - Ultimate achievement
    case 'elite':
      return '#FF4500'; // Bright Red-Orange - Elite performance
    case 'advanced':
      return '#FFD700'; // Bright Gold - Advanced skill
    case 'intermediate':
      return '#00FF00'; // Bright Lime Green - Solid intermediate
    case 'novice':
      return '#00BFFF'; // Bright Sky Blue - Learning stage
    case 'beginner':
      return '#9966FF'; // Bright Purple - Starting point
    default:
      return '#808080'; // Gray
  }
};

export const getLevelIntensity = (level: string): number => {
  switch (level.toLowerCase()) {
    case 'wr':
      return 0.9; // Maximum intensity for world record
    case 'elite':
      return 0.85; // Very high intensity for elite
    case 'advanced':
      return 0.8; // High intensity for advanced
    case 'intermediate':
      return 0.75; // Good intensity for intermediate
    case 'novice':
      return 0.7; // Moderate intensity for novice
    case 'beginner':
      return 0.65; // Lower intensity for beginner
    default:
      return 0.1;
  }
};
