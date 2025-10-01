import {
  CategoryTypeIdentifierWriteable,
  QuantityTypeIdentifierWriteable,
  SampleTypeIdentifierWriteable,
} from '@kingstinct/react-native-healthkit';

export const AllQuantityTypeIdentifierInApp: QuantityTypeIdentifierWriteable[] = [
  'HKQuantityTypeIdentifierStepCount',
  'HKQuantityTypeIdentifierDistanceCycling',
  'HKQuantityTypeIdentifierActiveEnergyBurned',
  'HKQuantityTypeIdentifierBasalEnergyBurned',
  'HKQuantityTypeIdentifierFlightsClimbed',
  'HKQuantityTypeIdentifierHeartRate',
  'HKQuantityTypeIdentifierDistanceWalkingRunning',
  'HKQuantityTypeIdentifierBodyMass',
  'HKQuantityTypeIdentifierBloodGlucose',
  'HKQuantityTypeIdentifierOxygenSaturation',
  'HKQuantityTypeIdentifierHeartRateVariabilitySDNN',
  'HKQuantityTypeIdentifierBodyTemperature',
  'HKQuantityTypeIdentifierBasalBodyTemperature',
  'HKQuantityTypeIdentifierBodyFatPercentage',
  'HKQuantityTypeIdentifierLeanBodyMass',
  'HKQuantityTypeIdentifierDietaryEnergyConsumed',
  'HKQuantityTypeIdentifierDietaryFatTotal',
  'HKQuantityTypeIdentifierDietaryFatPolyunsaturated',
  'HKQuantityTypeIdentifierDietaryFatMonounsaturated',
  'HKQuantityTypeIdentifierDietaryFatSaturated',
  'HKQuantityTypeIdentifierDietaryCholesterol',
  'HKQuantityTypeIdentifierDietarySodium',
  'HKQuantityTypeIdentifierDietaryCarbohydrates',
  'HKQuantityTypeIdentifierDietaryFiber',
  'HKQuantityTypeIdentifierDietarySugar',
  'HKQuantityTypeIdentifierDietaryProtein',
  'HKQuantityTypeIdentifierDietaryVitaminA',
  'HKQuantityTypeIdentifierDietaryVitaminB6',
  'HKQuantityTypeIdentifierDietaryVitaminB12',
  'HKQuantityTypeIdentifierDietaryVitaminC',
  'HKQuantityTypeIdentifierDietaryVitaminD',
  'HKQuantityTypeIdentifierDietaryVitaminE',
  'HKQuantityTypeIdentifierDietaryVitaminK',
  'HKQuantityTypeIdentifierDietaryCalcium',
  'HKQuantityTypeIdentifierDietaryIron',
  'HKQuantityTypeIdentifierDietaryThiamin',
  'HKQuantityTypeIdentifierDietaryRiboflavin',
  'HKQuantityTypeIdentifierDietaryNiacin',
  'HKQuantityTypeIdentifierDietaryFolate',
  'HKQuantityTypeIdentifierDietaryBiotin',
  'HKQuantityTypeIdentifierDietaryPantothenicAcid',
  'HKQuantityTypeIdentifierDietaryPhosphorus',
  'HKQuantityTypeIdentifierDietaryIodine',
  'HKQuantityTypeIdentifierDietaryMagnesium',
  'HKQuantityTypeIdentifierDietaryZinc',
  'HKQuantityTypeIdentifierDietarySelenium',
  'HKQuantityTypeIdentifierDietaryCopper',
  'HKQuantityTypeIdentifierDietaryManganese',
  'HKQuantityTypeIdentifierDietaryChromium',
  'HKQuantityTypeIdentifierDietaryMolybdenum',
  'HKQuantityTypeIdentifierDietaryChloride',
  'HKQuantityTypeIdentifierDietaryPotassium',
  'HKQuantityTypeIdentifierDietaryCaffeine',
  'HKQuantityTypeIdentifierDietaryWater',
  'HKQuantityTypeIdentifierInsulinDelivery',
  'HKQuantityTypeIdentifierBloodPressureSystolic',
  'HKQuantityTypeIdentifierBloodPressureDiastolic',
  'HKQuantityTypeIdentifierRespiratoryRate',
  'HKQuantityTypeIdentifierVO2Max',
];

export const AllCategorySampleTypeIdentifierInApp: CategoryTypeIdentifierWriteable[] = [
  'HKCategoryTypeIdentifierSleepAnalysis',
  'HKCategoryTypeIdentifierSleepChanges',
  'HKCategoryTypeIdentifierMindfulSession',
];

/* export const AllCharacteristicTypeIdentifierInApp: CharacteristicTypeIdentifier[] = [
  'HKCharacteristicTypeIdentifierBiologicalSex',
  'HKCharacteristicTypeIdentifierBloodType',
  'HKCharacteristicTypeIdentifierDateOfBirth',
  'HKCharacteristicTypeIdentifierFitzpatrickSkinType',
  'HKCharacteristicTypeIdentifierWheelchairUse',
  'HKCharacteristicTypeIdentifierActivityMoveMode',
]; */

export const AllSampleTypesInApp: SampleTypeIdentifierWriteable[] = [
  'HKWorkoutTypeIdentifier',
  'HKWorkoutRouteTypeIdentifier',
  'HKDataTypeIdentifierHeartbeatSeries',
  ...AllCategorySampleTypeIdentifierInApp,
  ...AllQuantityTypeIdentifierInApp,
];

// Sample types that need write permissions
export const SampleTypesToWrite: SampleTypeIdentifierWriteable[] = [
  'HKWorkoutTypeIdentifier',
  'HKQuantityTypeIdentifierDistanceWalkingRunning',
  /*   'HKQuantityTypeIdentifierDistanceCycling',
   */ 'HKQuantityTypeIdentifierActiveEnergyBurned',
  'HKQuantityTypeIdentifierStepCount',
];

// Sample types that need read permissions
export const SampleTypesToRead: SampleTypeIdentifierWriteable[] = [...AllSampleTypesInApp];
