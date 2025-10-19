import { useQuery } from '@tanstack/react-query';

import { GetLevelsRequest } from '@/services/rankingService/requestTypes';
import { fetchLevels } from '@/services/rankingService/service';

export const useLevels = (request: GetLevelsRequest) => {
  return useQuery({
    queryKey: ['levels', request.distance, request.unit, request.age, request.gender],
    queryFn: () => fetchLevels(request),
  });
};
