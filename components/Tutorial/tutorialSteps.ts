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
      x: 20,
      y: 80,
      width: 200,
      height: 80,
    },
    position: 'bottom',
  },
  {
    id: 'carousel_cards',
    title: 'Your Workout Groups',
    description:
      'Each card represents a group of similar workouts. The number shows the common value (like 5km for distance groups). Swipe to explore different groups.',
    targetElement: {
      x: 20,
      y: 200,
      width: 350,
      height: 180,
    },
    position: 'bottom',
  },
  {
    id: 'group_details',
    title: 'Group Information',
    description:
      'Notice how workouts with similar characteristics are grouped together. If some workouts are "excluded," they didn\'t fit the grouping criteria closely enough.',
    position: 'center',
  },
  {
    id: 'stats_section',
    title: 'Detailed Statistics',
    description:
      "Scroll down to see comprehensive stats for each group. Here you'll find your best and worst performances, trends, and detailed breakdowns.",
    targetElement: {
      x: 0,
      y: 400,
      width: 400,
      height: 300,
    },
    position: 'top',
  },
  {
    id: 'comparison_tab',
    title: 'Compare Workouts',
    description:
      'Use the Compare tab to see how different workouts stack up against each other. Perfect for tracking improvements and identifying patterns.',
    targetElement: {
      x: 50,
      y: 450,
      width: 100,
      height: 40,
    },
    position: 'top',
  },
  {
    id: 'predictions_tab',
    title: 'Future Predictions',
    description:
      'The Predictions tab uses your workout data to forecast future performance and suggest training targets.',
    targetElement: {
      x: 200,
      y: 450,
      width: 100,
      height: 40,
    },
    position: 'top',
  },
  {
    id: 'settings_config',
    title: 'Customize Your Experience',
    description:
      'Use the settings icon to adjust grouping sensitivity, group sizes, and other preferences to match your training style.',
    targetElement: {
      x: 340,
      y: 75,
      width: 48,
      height: 48,
    },
    position: 'bottom',
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
