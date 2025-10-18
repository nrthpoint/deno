import { useMutation } from '@tanstack/react-query';

import { rankingService, type RankingRequest } from '@/services/rankingService';

export const useRanking = () => {
  return useMutation({
    mutationFn: rankingService.getRanking,
    mutationKey: ['ranking'],
  });
};

export type { RankingRequest };
