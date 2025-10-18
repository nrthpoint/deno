import { useQuery } from '@tanstack/react-query';

import { rankingService, type GetLevelsRequest } from '@/services/rankingService';

export const useLevels = (request: GetLevelsRequest, enabled = true) => {
  return useQuery({
    queryKey: ['levels', request.distance, request.unit, request.age, request.gender],
    queryFn: () => rankingService.getLevels(request),
    enabled,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours - levels don't change frequently
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export type { GetLevelsRequest };
