# Achievement Push Notifications

This document explains how the enhanced achievement notification system works and how to set it up.

## Overview

The app now supports push notifications for new achievements when the app is closed or in the background. This allows users to be notified immediately when they achieve new personal bests without having to open the app.

## Features

### ✅ Currently Implemented

1. **In-App Notifications**: Toast notifications when the app is active
2. **Push Notifications**: System notifications when the app is closed
3. **Notification Settings**: User preferences for controlling notifications
4. **Permission Handling**: Automatic request for notification permissions
5. **Achievement Integration**: Works with existing achievement system

### 🚧 In Development

1. **Background Tasks**: Automatic background checking for new achievements
2. **Rich Notifications**: Enhanced notification content with workout details
3. **Deep Linking**: Opening specific workout when notification is tapped

## How It Works

### Notification Flow

1. **App Active**: Shows toast notifications using the existing system
2. **App Closed**: Sends push notifications through iOS/Android notification system
3. **User Interaction**: Tapping notifications can open the app to relevant content

### Achievement Detection

1. **Real-time**: When app is active, achievements are detected immediately
2. **Background**: Planned feature to check for achievements periodically
3. **On App Open**: Always checks for new achievements when app becomes active

## Setup Instructions

### 1. Install Dependencies

The following packages have been added:

```bash
pnpm add expo-notifications expo-task-manager expo-background-fetch
```

### 2. Configuration

The `app.config.js` has been updated with:

- expo-notifications plugin configuration
- iOS notification permissions in infoPlist
- Notification channel setup for Android

### 3. Permission Handling

Notifications automatically request permission when the app starts. Users can:

- Grant or deny permission through system prompt
- Change preferences later in device settings
- Configure app-specific settings in the Settings tab

## User Controls

### Settings Page

Users can control notifications through the Settings tab:

1. **Enable Notifications**: Master toggle for all notifications
2. **Achievement Alerts**: Specific toggle for achievement notifications
3. **Sound Alerts**: Control whether notifications play sound
4. **Test Notifications**: Send a test notification to verify setup

### Testing

The app includes developer tools for testing:

- Send test notifications
- Force background checks (planned)
- Check notification timing (planned)
- Clear notification history

## Implementation Details

### Key Files

1. **`utils/notificationService.ts`**: Core notification functionality
2. **`utils/backgroundAchievements.ts`**: Background achievement checking
3. **`utils/achievements.ts`**: Enhanced to support push notifications
4. **`components/NotificationSettings/`**: User interface components

### Notification Types

Currently supports notifications for:

- 🏃‍♂️ **Fastest Pace**: New personal best pace achieved
- ⏱️ **Longest Duration**: New longest workout duration
- 🏁 **Furthest Distance**: New furthest distance achieved
- 🏔️ **Highest Elevation**: New highest elevation gain

### Data Storage

- **AsyncStorage**: Used for notification preferences and timing
- **Achievement History**: Tracks previous achievements to detect new ones
- **App State**: Monitors whether app is active for notification routing

## Future Enhancements

### Planned Features

1. **Background Tasks**:
   - Automatic checking for achievements when app is closed
   - Uses HealthKit background refresh capabilities
   - Respects system limits on background execution

2. **Enhanced Notifications**:
   - Rich notification content with workout details
   - Notification actions (view workout, dismiss)
   - Grouped notifications for multiple achievements

3. **Smart Timing**:
   - Machine learning to optimize notification timing
   - Respect user's "Do Not Disturb" preferences
   - Intelligent batching of multiple achievements

4. **Deep Linking**:
   - Open specific workout when notification is tapped
   - Navigate to achievement details
   - Show progress toward next milestone

### Technical Improvements

1. **Background Fetch**: More reliable background checking
2. **Error Handling**: Better error recovery and user feedback
3. **Performance**: Optimized background task execution
4. **Analytics**: Track notification effectiveness and user engagement

## Troubleshooting

### Common Issues

1. **Notifications Not Appearing**:
   - Check device notification settings
   - Verify app has notification permission
   - Test with the built-in test button

2. **Background Tasks Not Working**:
   - Ensure iOS background app refresh is enabled
   - Check that HealthKit permissions are granted
   - Background tasks have system limitations

3. **Permission Denied**:
   - Guide users to device settings
   - Explain benefits of enabling notifications
   - Provide alternative in-app notification options

### Debug Tools

The app includes debug tools in the Settings page:

- Test notification sending
- Check permission status
- View next background task timing
- Clear stored achievement history

## Privacy & Permissions

### Required Permissions

1. **Notifications**: Required for push notifications
2. **HealthKit**: Required for achievement detection
3. **Background Refresh**: Optional, improves background detection

### Data Handling

- All data stored locally on device
- No personal information sent to external servers
- Achievement history used only for notification logic
- User preferences respected and stored securely

## Getting Started

1. **Build and Install**: Use the updated app configuration
2. **Grant Permissions**: Allow notifications when prompted
3. **Configure Settings**: Customize notification preferences in Settings
4. **Test Functionality**: Use the test button to verify notifications work
5. **Complete Workouts**: Achieve new personal bests to see notifications in action

The notification system is designed to enhance the user experience by providing timely feedback on achievements while respecting user preferences and system limitations.
