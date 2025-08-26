import { GroupType } from '@/types/Groups';

export const getConfigLabels = (groupType: GroupType, distanceUnit: string) => {
  switch (groupType) {
    case 'distance':
      return {
        tolerance: {
          label: 'Distance Tolerance',
          unit: distanceUnit,
          min: 0.1,
          max: 1.0,
          step: 0.1,
        },
        groupSize: {
          label: 'Distance Grouping',
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
          unit: 'min',
          min: 0.1,
          max: 1.0,
          step: 0.1,
        },
        groupSize: {
          label: 'Pace Grouping',
          unit: 'min',
          min: 0.2,
          max: 2.0,
          step: 0.2,
        },
      };
    case 'altitude':
      return {
        tolerance: {
          label: 'Elevation Tolerance',
          unit: 'm',
          min: 25,
          max: 200,
          step: 25,
        },
        groupSize: {
          label: 'Elevation Grouping',
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
          unit: '',
          min: 0.1,
          max: 1.0,
          step: 0.1,
        },
        groupSize: {
          label: 'Group Size',
          unit: '',
          min: 0.2,
          max: 2.0,
          step: 0.2,
        },
      };
  }
};
