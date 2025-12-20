/**
 * PostHog Analytics Event Names
 * Centralized constants for all analytics events tracked in the app
 */

export const ANALYTICS_EVENTS = {
  // Navigation
  TAB_CHANGED: 'tab_changed',
  SCREEN_VIEWED: 'screen_viewed',
  PAGEVIEW: '$pageview',

  // Carousel interactions
  CAROUSEL_SWIPE: 'carousel_swipe',

  // Group interactions
  GROUP_TYPE_CHANGED: 'group_type_changed',
  GROUP_SELECTED: 'group_selected',

  // Modal interactions
  MODAL_OPENED: 'modal_opened',
  MODAL_CLOSED: 'modal_closed',

  // Workout interactions
  WORKOUT_VIEWED: 'workout_viewed',
  WORKOUT_ADDED: 'workout_added',
  WORKOUT_DELETED: 'workout_deleted',

  // Map interactions
  MAP_OPENED: 'map_opened',
  MAP_CLOSED: 'map_closed',
  MAP_TYPE_CHANGED: 'map_type_changed',
  MAP_PACE_MODE_CHANGED: 'map_pace_mode_changed',
  MAP_ROUTE_TOGGLED: 'map_route_toggled',

  // Comparison interactions
  COMPARISON_MODE_CHANGED: 'comparison_mode_changed',
  COMPARISON_SAMPLE_CHANGED: 'comparison_sample_changed',

  // Settings
  SETTING_CHANGED: 'setting_changed',
  DISTANCE_UNIT_CHANGED: 'distance_unit_changed',
  THEME_CHANGED: 'theme_changed',

  // Tutorial
  TUTORIAL_STARTED: 'tutorial_started',
  TUTORIAL_COMPLETED: 'tutorial_completed',
  TUTORIAL_STEP_VIEWED: 'tutorial_step_viewed',
  TUTORIAL_SKIPPED: 'tutorial_skipped',

  // Errors
  ERROR_OCCURRED: 'error_occurred',
  ERROR_BOUNDARY_TRIGGERED: 'error_boundary_triggered',
} as const;

/**
 * Screen Names for PostHog $pageview Events
 * Centralized constants for all screen names used in pageview tracking
 */
export const SCREEN_NAMES = {
  // Tab Screens
  HOME: 'HomeScreen',
  TRENDS: 'TrendsScreen',
  PROFILE: 'ProfileScreen',
  SETTINGS: 'SettingsScreen',

  // Modal Screens
  ADD_WORKOUT: 'AddWorkoutModal',
  VIEW_WORKOUT: 'ViewWorkoutModal',
  NO_WORKOUTS: 'NoWorkoutsScreen',
  RANKING_LEVELS: 'RankingLevelsModal',

  // Trend Detail Screens
  PACE_BY_DISTANCE: 'PaceByDistanceScreen',
  WEEKLY_PATTERNS: 'WeeklyPatternsScreen',
  MAP_DETAIL: 'MapDetailScreen',

  // Bottom Sheets
  GROUP_TYPE_SELECTOR: 'GroupTypeBottomSheet',
  WORKOUT_LIST: 'WorkoutListBottomSheet',
} as const;

// Type for all analytics event names
export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

// Type for all screen names
export type ScreenName = (typeof SCREEN_NAMES)[keyof typeof SCREEN_NAMES];
