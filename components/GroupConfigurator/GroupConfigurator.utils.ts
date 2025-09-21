import { GroupType } from '@/types/Groups';

export const getConfigLabels = (groupType: GroupType, distanceUnit: string, groupSize?: number) => {
  // Calculate dynamic tolerance max as half the group size
  const dynamicToleranceMax = groupSize ? groupSize / 2 : 1.0;

  switch (groupType) {
    case 'distance':
      return {
        tolerance: {
          label: 'Distance Tolerance',
          subheading: 'The allowed variance in workout distance (max half of group size)',
          unit: distanceUnit,
          min: 0.0,
          max: dynamicToleranceMax,
          step: 0.1,
        },
        groupSize: {
          label: 'Distance Grouping',
          subheading: 'Size of distance ranges to group workouts in',
          unit: distanceUnit,
          min: 0.5,
          max: 2.0,
          step: 0.5,
        },
      };
    case 'pace':
      return {
        tolerance: {
          label: 'Pace Tolerance',
          subheading: 'How close paces need to be to group together (max half of group size)',
          unit: 'min',
          min: 0.0,
          max: dynamicToleranceMax,
          step: 0.1,
        },
        groupSize: {
          label: 'Pace Grouping',
          subheading: 'Size of pace ranges for grouping workouts',
          unit: 'min',
          min: 0.2,
          max: 2.0,
          step: 0.2,
        },
      };
    case 'elevation':
      return {
        tolerance: {
          label: 'Elevation Tolerance',
          subheading:
            'How close elevation gains need to be to group together (max half of group size)',
          unit: 'm',
          min: 0,
          max: dynamicToleranceMax,
          step: 0.1,
        },
        groupSize: {
          label: 'Elevation Grouping',
          subheading: 'Size of elevation ranges for grouping workouts',
          unit: 'm',
          min: 50,
          max: 500,
          step: 50,
        },
      };
    case 'duration':
      return {
        tolerance: {
          label: 'Duration Tolerance',
          subheading: 'How close durations need to be to group together (max half of group size)',
          unit: 'min',
          min: 0,
          max: dynamicToleranceMax,
          step: 0.1,
        },
        groupSize: {
          label: 'Duration Grouping',
          subheading: 'Size of duration ranges for grouping workouts',
          unit: 'min',
          min: 5,
          max: 60,
          step: 5,
        },
      };
    default:
      return {
        tolerance: {
          label: 'Tolerance',
          subheading: 'How close values need to be to group together (max half of group size)',
          unit: '',
          min: 0.0,
          max: dynamicToleranceMax,
          step: 0.1,
        },
        groupSize: {
          label: 'Group Size',
          subheading: 'Size of ranges for grouping workouts',
          unit: '',
          min: 0.2,
          max: 2.0,
          step: 0.2,
        },
      };
  }
};
