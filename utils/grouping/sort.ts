import { WorkoutGroupWithHighlightSet } from '@/types/workout';

export const assignRankToGroups = (
  groups: WorkoutGroupWithHighlightSet,
): WorkoutGroupWithHighlightSet => {
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

export const sortGroupsByKeyInAscending = (
  groups: WorkoutGroupWithHighlightSet,
): WorkoutGroupWithHighlightSet => {
  const sortedGroups: WorkoutGroupWithHighlightSet = {};
  const keys = Object.keys(groups);

  console.log('Sorting groups by key in ascending order:', keys);

  keys
    .sort((a, b) => parseFloat(a) - parseFloat(b))
    .forEach((key) => {
      sortedGroups[key] = groups[key];
    });

  console.log('Sorted groups:', Object.keys(sortedGroups));

  return sortedGroups;
};
