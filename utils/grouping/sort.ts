import { Groups } from '@/types/Groups';

export const assignRankToGroups = (groups: Groups): Groups => {
  // Set ranks based on the number of runs in each group
  const sortedGroups = Object.values(groups).sort((a, b) => b.runs.length - a.runs.length);

  sortedGroups.forEach((group, index) => {
    group.rank = index + 1;

    // Add rank suffix for display. Include "least common" for the last group
    const isLeastCommon = index === sortedGroups.length - 1;
    const isMostCommon = index === 0;

    if (isLeastCommon) {
      group.rankLabel = 'Least Common';
    } else if (isMostCommon) {
      group.rankLabel = 'Most Common';
    } else {
      group.rankLabel = `${index + 1}th Most Common`;
    }
  });

  return groups;
};

export const sortGroupsByKeyInAscending = (groups: Groups): Groups => {
  const sortedGroups: Groups = {};
  const keys = Object.keys(groups);

  keys
    .sort((a, b) => parseFloat(a) - parseFloat(b))
    .forEach((key) => {
      sortedGroups[key] = groups[key];
    });

  return sortedGroups;
};
