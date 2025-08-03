import { WorkoutGroupWithHighlight } from '@/types/workout';
import { Ionicons } from '@expo/vector-icons';
import { Stat } from '@/components/StatCard/StatCard.types';

export const getStatIcon = (label: string) => {
  const lowerLabel = label.toLowerCase();

  if (lowerLabel === 'slowest run') {
    return <Ionicons name="thumbs-down-outline" size={40} color="#FFFFFF" />;
  }

  if (lowerLabel === 'worst pace') {
    return <Ionicons name="trending-down-outline" size={40} color="#FFFFFF" />;
  }

  if (lowerLabel === 'cumulative distance') {
    return <Ionicons name="person-add-outline" size={40} color="#FFFFFF" />;
  }

  if (lowerLabel === 'cumulative duration') {
    return <Ionicons name="timer-outline" size={40} color="#FFFFFF" />;
  }

  if (lowerLabel.includes('time') || lowerLabel.includes('duration')) {
    return <Ionicons name="stopwatch-outline" size={40} color="#FFFFFF" />;
  }

  if (lowerLabel.includes('distance')) {
    return <Ionicons name="location" size={40} color="#FFFFFF" />;
  }

  if (lowerLabel.includes('pace') || lowerLabel.includes('speed')) {
    return <Ionicons name="speedometer" size={40} color="#FFFFFF" />;
  }

  if (lowerLabel.includes('heart') || lowerLabel.includes('hr')) {
    return <Ionicons name="heart" size={40} color="#FFFFFF" />;
  }

  return <Ionicons name="stats-chart" size={40} color="#FFFFFF" />;
};

export const createGroupSizeStat = (group: WorkoutGroupWithHighlight): Stat => ({
  type: 'default',
  label: 'Total Runs in Group',
  value: { quantity: group.runs?.length || 0, unit: 'runs' },
  icon: <Ionicons name="podium-outline" size={40} color="#FFFFFF" />,
  hasTooltip: true,
  detailTitle: 'Group Size',
  detailDescription: 'The total number of workout sessions included in this performance group.',
  additionalInfo: [
    { label: 'Average per Week', value: `${((group.runs?.length || 0) / 4).toFixed(1)}` },
    { label: 'Group Category', value: group.title || 'Performance Group' },
  ],
});

export const enhanceStatWithDefaults = (stat: any): Stat => ({
  type: stat.type || 'default',
  label: stat.label,
  value: stat.value,
  icon: getStatIcon(stat.label),
  hasTooltip: false,
});
