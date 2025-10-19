import { useMutation } from '@tanstack/react-query';

import { rankingService, type RankingRequest } from '@/services/rankingService';
import { Group } from '@/types/Groups';

export const useRanking = (group?: Group) => {
  return useMutation({
    mutationFn: (request: Omit<RankingRequest, 'groupKey'>) =>
      rankingService.getRanking({
        ...request,
        groupKey: group?.key,
      }),
    mutationKey: ['ranking', group?.key],
  });
};

export type { RankingRequest };
