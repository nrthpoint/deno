import { useQuery } from '@tanstack/react-query';

import { RankingRequest } from '@/services/rankingService/requestTypes';
import { fetchRanking } from '@/services/rankingService/service';

export const useRanking = (request: RankingRequest) => {
  const missingParams: string[] = [];

  if (!request.distance) missingParams.push('distance');
  if (!request.unit) missingParams.push('unit');
  if (!request.age) missingParams.push('age');
  if (!request.gender) missingParams.push('gender');
  if (!request.time) missingParams.push('time');

  const hasAllParams = missingParams.length === 0;

  const queryResult = useQuery({
    queryFn: () => fetchRanking(request),
    queryKey: ['ranking', request.distance, request.unit, request.age, request.gender],
    enabled: hasAllParams,
  });

  if (!hasAllParams) {
    return {
      ...queryResult,
      error: new Error(`Missing ${missingParams.join(', ')}`),
      isError: true,
    };
  }

  return queryResult;
};
