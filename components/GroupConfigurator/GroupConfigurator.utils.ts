import { GroupType } from '@/types/Groups';

export const getConfigLabels = (groupType: GroupType, distanceUnit: string) => {
  switch (groupType) {
    case 'distance':
      return {
        tolerance: {
          label: 'Distance Tolerance',
          subheading: 'The allowed variance in workout distance',
          unit: distanceUnit,
          min: 0.0,
          max: 1.0,
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
          subheading: 'How close paces need to be to group together',
          unit: 'min',
          min: 0.1,
          max: 1.0,
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
          subheading: 'How close elevation gains need to be to group together',
          unit: 'm',
          min: 25,
          max: 200,
          step: 25,
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
    default:
      return {
        tolerance: {
          label: 'Tolerance',
          subheading: 'How close values need to be to group together',
          unit: '',
          min: 0.1,
          max: 1.0,
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
