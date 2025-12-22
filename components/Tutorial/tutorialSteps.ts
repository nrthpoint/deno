import { TutorialStep } from './TutorialOverlay';

export const tutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Deno!',
    description:
      "Let's take a quick tour to help you understand how your workouts are organized and analyzed.",
    position: 'center',
    showSkip: true,
  },
  {
    id: 'grouping_explanation',
    title: 'Smart Workout Grouping',
    description:
      'Deno automatically groups your similar workouts together by distance, pace, duration, or elevation. This helps you track patterns and improvements in your training.',
    position: 'center',
  },
  {
    id: 'group_type_selector',
    title: 'Choose Your Grouping',
    description:
      'Tap here to switch between different grouping types. Each type shows your workouts organized differently - perfect for different training goals.',
    targetElement: {
      x: 15,
      y: 70,
      width: 110,
      height: 70,
    },
    position: 'bottom',
  },
  {
    id: 'carousel_cards',
    title: 'Your Workout Groups',
    description:
      'Each card represents a group of similar workouts. The number shows the common value (like 5km for distance groups). Swipe to explore different groups.',
    targetElement: {
      x: 25,
      y: 170,
      width: 350,
      height: 180,
    },
    position: 'bottom',
  },
  {
    id: 'stats_section',
    title: 'Detailed Statistics',
    description:
      "Scroll down to see comprehensive stats for each group. Here you'll find your best and worst performances, trends, and detailed breakdowns.",
    targetElement: {
      x: 10,
      y: 390,
      width: 375,
      height: 290,
    },
    position: 'top',
  },
  {
    id: 'stats_tab',
    title: 'Analyze Your Workouts',
    description:
      'Use the Compare tab to see how different workouts stack up against each other. Perfect for tracking improvements and identifying patterns.',
    targetElement: {
      x: 15,
      y: 395,
      width: 123,
      height: 39,
    },
    position: 'top',
  },
  {
    id: 'compare_tab',
    title: 'Compare Your Workouts',
    description:
      'The Analysis tab provides deeper insights into your training data, helping you understand performance trends and areas for improvement.',
    targetElement: {
      x: 140,
      y: 395,
      width: 110,
      height: 39,
    },
    position: 'top',
  },
  {
    id: 'predictions_tab',
    title: 'Get Some Predictions',
    description:
      'The Predictions tab uses your workout data to forecast future performance and suggest training targets.',
    targetElement: {
      x: 250,
      y: 395,
      width: 123,
      height: 39,
    },
    position: 'top',
  },
  {
    id: 'settings_config',
    title: 'Select Your Time Period',
    description:
      'Tap the clock icon to choose how far back to include workouts - from the last 7 days to all time. This helps you focus on recent training or see your complete history.',
    targetElement: {
      x: 324,
      y: 76,
      width: 44,
      height: 44,
    },
    position: 'bottom',
  },
  {
    // add a manual workout.
    id: 'add_workout',
    title: 'Add Manual Workouts',
    description:
      'Tap the "+" button to manually add workouts that may not have been automatically recorded. This ensures all your training is tracked in one place.',
    targetElement: {
      x: 268,
      y: 76,
      width: 44,
      height: 44,
    },
    position: 'top',
  },
  {
    id: 'complete',
    title: "You're All Set!",
    description:
      "That's the basics! Explore your workouts, compare performances, and track your progress. Happy training!",
    position: 'center',
    showSkip: false,
  },
];
