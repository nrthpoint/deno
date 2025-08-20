// app.config.js
import 'dotenv/config';

export default {
  expo: {
    name: 'Deno',
    slug: 'deno',
    version: require('./package.json').version,
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'deno',
    userInterfaceStyle: 'dark',
    newArchEnabled: true,
    assetBundlePatterns: ['**/*'],
    platforms: ['ios'],
    githubUrl: 'https://github.com/nrthpoint/deno',
    ios: {
      supportsTablet: false,
      bundleIdentifier: 'com.nrthpoint.deno',
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        NSHealthShareUsageDescription:
          'This app needs access to HealthKit data to track and analyze your workout activities, including distance, duration, and pace information.',
        NSHealthUpdateUsageDescription:
          'This app needs to write workout data to HealthKit to keep your fitness information synchronized across devices.',
        NSLocationWhenInUseUsageDescription:
          'This app requires location permission for map functionality.',
      },
    },
    plugins: [
      [
        'react-native-maps',
        {
          iosGoogleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
          androidGoogleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
        },
      ],
      'expo-router',
      'expo-screen-orientation',
      [
        '@kingstinct/react-native-healthkit',
        {
          NSHealthShareUsageDescription:
            'This app needs access to HealthKit data to track and analyze your workout activities, including distance, duration, and pace information.',
          NSHealthUpdateUsageDescription:
            'This app needs to write workout data to HealthKit to keep your fitness information synchronized across devices.',
          background: true,
        },
      ],
      'expo-web-browser',
      'expo-updates',
      [
        'expo-insights',
        {
          // Optional: Configure expo-insights
          enableCrashReporting: true,
          enablePerformanceMonitoring: true,
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: '9f72da41-06ea-4062-a451-99638abf36cb',
      },
    },
    updates: {
      url: 'https://u.expo.dev/9f72da41-06ea-4062-a451-99638abf36cb',
      requestHeaders: {
        'expo-channel-name': 'preview',
      },
    },
    runtimeVersion: {
      policy: 'appVersion',
    },
    owner: 'nrthpoint',
  },
};
