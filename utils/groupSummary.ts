import { Group, GroupType } from '@/types/Groups';
import { convertShortUnitToLong } from '@/utils/distance';

interface TimeRangeInfo {
  days: number;
  label: string;
}

const getTimeRangeLabel = (timeRangeInDays: number): TimeRangeInfo => {
  if (timeRangeInDays <= 7) {
    return { days: timeRangeInDays, label: 'this week' };
  } else if (timeRangeInDays <= 30) {
    return { days: timeRangeInDays, label: 'this month' };
  } else if (timeRangeInDays <= 90) {
    const months = Math.round(timeRangeInDays / 30);
    return { days: timeRangeInDays, label: `the last ${months} month${months > 1 ? 's' : ''}` };
  } else if (timeRangeInDays <= 365) {
    const months = Math.round(timeRangeInDays / 30);
    return { days: timeRangeInDays, label: `the last ${months} months` };
  } else {
    const years = Math.round(timeRangeInDays / 365);
    return { days: timeRangeInDays, label: `the last ${years} year${years > 1 ? 's' : ''}` };
  }
};

const getGroupTypeContext = (groupType: GroupType, group: Group): string => {
  const isIndoor = group.isIndoor ? 'indoor ' : '';
  const runPlural = group.runs.length === 1 ? 'run' : 'runs';
  const longUnit = convertShortUnitToLong({
    unit: group.unit,
    amount: group.key === 'All' ? group.runs.length : parseInt(group.key, 10),
  });

  switch (groupType) {
    case 'distance':
      return `${isIndoor}${runPlural} for ${group.key} ${longUnit}`;
    case 'pace':
      return `${isIndoor}${runPlural} at ${group.key} ${longUnit} pace`;
    case 'duration':
      return `${isIndoor}${runPlural} lasting ${group.key} ${longUnit}`;
    case 'elevation':
      return `${isIndoor}${runPlural} with ${group.key} ${longUnit} elevation gain`;
    default:
      return `${isIndoor}${runPlural}`;
  }
};

const getSummaryAction = (groupType: GroupType): string => {
  switch (groupType) {
    case 'distance':
      return 'some interesting stats';
    case 'pace':
      return 'your performance';
    case 'duration':
      return 'your achievements';
    case 'elevation':
      return 'your climbing performance';
    default:
      return 'your performance';
  }
};

const formatDaysAgo = (date: Date): string => {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'today';
  if (diffDays === 1) return '1 day ago';

  return `${diffDays} days ago`;
};

export const generateGroupSummary = (
  group: Group,
  groupType: GroupType,
  timeRangeInDays: number,
): string => {
  const timeRange = getTimeRangeLabel(timeRangeInDays);
  const groupContext = getGroupTypeContext(groupType, group);
  const summaryAction = getSummaryAction(groupType);

  const runCount = group.runs.length;

  // Calculate workout timing
  const mostRecentText = formatDaysAgo(group.mostRecent.endDate);
  const oldestText = formatDaysAgo(group.oldest.endDate);

  const firstLine = `Here are ${summaryAction} from your **${runCount}** ${groupContext} over ${timeRange.label}.`;

  let secondLine: string;

  if (runCount === 1) {
    secondLine = `Your only workout was **${mostRecentText}**.`;
  } else if (group.mostRecent.endDate.getTime() === group.oldest.endDate.getTime()) {
    // All workouts are from the same day
    secondLine = `All your workouts were **${mostRecentText}**.`;
  } else {
    secondLine = `Your most recent workout was **${mostRecentText}**, and your oldest was **${oldestText}**.`;
  }

  return `${firstLine} ${secondLine}`;
};

export const shouldShowLowDataWarning = (group: Group): boolean => {
  return group.runs.length < 3;
};

export const generateLowDataWarningMessage = (group: Group, groupType: GroupType): string => {
  const runCount = group.runs.length;
  const groupContext = getGroupTypeContext(groupType, group);

  if (runCount === 0) {
    return `No ${groupContext} found. Complete more workouts to see detailed statistics.`;
  } else if (runCount === 1) {
    return `Only 1 ${groupContext.replace('runs', 'run')} found. Complete more similar workouts for better insights, or extend the time period to include more data.`;
  } else {
    return `Only ${runCount} ${groupContext} found. Complete more similar workouts for more reliable statistics.`;
  }
};
