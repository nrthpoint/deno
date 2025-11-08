import { useQuery } from '@tanstack/react-query';

import { RankingRequest } from '@/services/rankingService/requestTypes';
import { fetchRanking } from '@/services/rankingService/service';

export const useRanking = (request: RankingRequest) => {
  return useQuery({
    queryFn: () => fetchRanking(request),
    queryKey: ['ranking', request.distance, request.unit, request.age, request.gender],
  });
};
