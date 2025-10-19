import { RankingRequest, GetLevelsRequest } from './requestTypes';
import { RawRankingResponse, RawLevelsResponse } from './responseTypes';
import { Ranking, Levels } from './types';

const BASE_URL = process.env.EXPO_PUBLIC_RANKING_API_BASE_URL || 'https://api.deno.fit';

export const fetchRanking = async (request: RankingRequest): Promise<Ranking> => {
  const response = await fetch(`${BASE_URL}/ranking`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const data = (await response.json()) as {
      error: string;
      message: string;
    };

    throw new Error(`Failed to fetch ranking: ${data.message}`);
  }

  const rawRankingResponse: RawRankingResponse = await response.json();

  // Parse and transform the raw response into the Ranking type
  const ranking: Ranking = {
    level: rawRankingResponse.level,
    rank: rawRankingResponse.rank,
    percentile: rawRankingResponse.percentile,
    totalAthletes: rawRankingResponse.totalAthletes,
    yourTime: { quantity: parseFloat(rawRankingResponse.yourTime), unit: 's' },
    averageTime: { quantity: parseFloat(rawRankingResponse.averageTime), unit: 's' },
    yourPace: { quantity: rawRankingResponse.yourPace, unit: `min/${request.unit}` },
    averagePace: { quantity: rawRankingResponse.averagePace, unit: `min/${request.unit}` },
    betterThanPercent: rawRankingResponse.betterThanPercent,
  };

  return ranking;
};

export const fetchLevels = async ({
  distance,
  unit,
  age,
  gender,
}: GetLevelsRequest): Promise<Levels> => {
  const response = await fetch(
    `${BASE_URL}/levels?distance=${distance}&unit=${unit}&age=${age}&gender=${gender}`,
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Failed to fetch levels: ${data.message}`);
  }

  const rawLevelsResponse: RawLevelsResponse = data;

  // Parse and transform the raw response into the Levels type
  const levels: Levels = {
    distance,
    unit,
    age,
    gender,
    levels: rawLevelsResponse.levels.map((rawLevel) => ({
      level: rawLevel.level,
      expectedPace: { quantity: rawLevel.expectedPace, unit: `min/${unit}` },
      expectedTime: { quantity: parseFloat(rawLevel.expectedTime), unit: 's' },
      ageRange: rawLevel.ageRange,
    })),
  };

  return levels;
};
