import { usePathname } from 'expo-router';
import { usePostHog } from 'posthog-react-native';
import { useEffect } from 'react';

interface PageViewOptions {
  screenName: string;
  properties?: Record<string, any>;
}

/**
 * Hook to automatically track PostHog $pageview events
 * Should be called in each screen/modal/bottom sheet component
 *
 * @param screenName - Human-readable name of the screen (e.g., 'HomeScreen', 'AddWorkoutModal')
 * @param properties - Optional additional properties to include with the pageview event
 *
 * @example
 * ```tsx
 * function HomeScreen() {
 *   usePageView({ screenName: 'HomeScreen' });
 *   // ... rest of component
 * }
 * ```
 */
export function usePageView({ screenName, properties = {} }: PageViewOptions) {
  const posthog = usePostHog();
  const pathname = usePathname();

  useEffect(() => {
    posthog?.capture('$pageview', {
      $current_url: `app://${pathname}`,
      $pathname: pathname,
      $screen_name: screenName,
      ...properties,
    });
  }, [posthog, pathname, screenName, properties]);
}
