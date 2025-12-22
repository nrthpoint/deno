# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Deno is a fitness milestone tracker React Native app built with Expo. It uses HealthKit integration to track running workouts and provides achievements, statistics, and data visualization. The app is optimized for iOS-only development with EAS (Expo Application Services) for rapid iteration.

## Development Commands

### Package Manager

This project uses `pnpm` as the package manager.

### Core Development

- `pnpm start` - Start Expo development server
- `pnpm sim` - Run on iOS simulator (iPhone Air)
- `pnpm device` - Run on specific physical device (configured for UUID: 00008150-001E51923C00401C)
- `pnpm ios` - Run on iOS (generic)
- `pnpm android` - Run on Android

### Testing

- `pnpm test` - Run Jest tests
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:coverage` - Run tests with coverage report

### Code Quality

- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint issues automatically
- `pnpm format` - Format code with Prettier
- `pnpm check-format` - Check Prettier formatting

### Build & Deployment (EAS)

- `pnpm build` - Production build for App Store
- `pnpm submit` - Submit to App Store
- `pnpm update` - Push EAS update to production channel

### EAS Update Workflow (Rapid Iteration)

The project uses EAS Update for instant over-the-air updates without full rebuilds:

1. **Initial Setup**: Build and install a development build once
2. **Daily Development**: Push instant updates with `pnpm update`
3. **Update Channels**:
   - `development` - Local development with debug features
   - `production` - Live app users (default for `pnpm update`)

This enables rapid iteration by pushing code changes in seconds rather than rebuilding the entire app.

### Utilities

- `pnpm clean` - Clean Expo prebuild
- `pnpm prebuild` - Generate native iOS/Android directories

## Architecture

### App Structure (Expo Router)

- **`app/_layout.tsx`** - Root layout with providers (Settings, Workout, Paper, Toast)
- **`app/(tabs)/`** - Main tab navigation (index, profile, settings, trends)
- **`app/add-workout.tsx`** - Modal for adding workouts
- **`app/view-workout.tsx`** - Modal for viewing workout details

### Key Directories

- **`services/`** - Core business logic (achievements, notifications, background tasks)
- **`context/`** - React contexts (WorkoutContext, SettingsContext, ThemeContext)
- **`components/`** - Reusable UI components organized by feature
- **`grouping-engine/`** - Custom workout grouping and statistics engine
- **`types/`** - TypeScript type definitions
- **`utils/`** - Utility functions and helpers
- **`hooks/`** - Custom React hooks

### Core Systems

#### Workout Data Management

- Uses `@kingstinct/react-native-healthkit` for HealthKit integration
- `ExtendedWorkout` type extends HealthKit data with additional properties
- Context-based state management using reducer pattern in `context/Workout/`
- Modular architecture with separate files for actions, reducer, hooks, and types

#### Grouping Engine

- Custom system for grouping workouts by distance, pace, duration, etc.
- Configurable tolerance and group sizes
- Statistical calculations for workout analysis
- Located in `grouping-engine/` directory

#### Achievement System

- Tracks personal bests (fastest, longest, furthest, highest elevation)
- Compares with previously stored achievements in AsyncStorage
- Shows toast notifications for new achievements
- Prevents duplicate notifications

#### Notifications & Background Tasks

- Expo notifications for achievements and reminders
- Background task registration for data processing
- App state monitoring for notification handling

### Configuration

#### Import Rules (ESLint)

- Use `@/` imports instead of relative imports that go up directories
- Enforced import ordering: builtin → external → internal (@/) → parent → sibling
- No unused styles rule for React Native

#### Type System

- Strict TypeScript configuration
- Path mapping with `@/*` pointing to root
- Jest types included for testing

#### EAS Configuration

- Development builds use internal distribution with simulator support
- Production builds auto-increment version numbers
- Configured for iOS-only deployment

## Testing

Tests are configured for the `utils/` directory only using Jest and ts-jest. Coverage reports are generated in the `coverage/` directory.

### Running Specific Tests

- `pnpm test <file>` - Run specific test file (e.g., `pnpm test workoutSplits.test.ts`)
- `pnpm test:watch` - Run tests in watch mode for active development
- `pnpm test:coverage` - Generate coverage reports

## Key Dependencies

### Core Framework

- React Native 0.81.4 with React 19.1.0
- Expo SDK ~54.0.12 with Expo Router for navigation

### Fitness & Health

- `@kingstinct/react-native-healthkit` for HealthKit integration
- Custom grouping engine for workout analysis

### UI & Navigation

- React Native Paper for UI components
- React Native Reanimated for animations
- React Native Maps for location features

### State & Storage

- React Context for state management
- AsyncStorage for persistent data

### Development

- EAS for builds and over-the-air updates
- Husky for git hooks
- ESLint + Prettier for code quality

# important-instruction-reminders

Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (\*.md) or README files. Only create documentation files if explicitly requested by the User.
