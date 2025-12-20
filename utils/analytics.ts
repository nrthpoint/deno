import { ANALYTICS_EVENTS } from '@/constants/analytics';

import type { PostHog } from 'posthog-react-native';

/**
 * Log an error to PostHog with context
 * Use this instead of console.error for production error tracking
 */
export const logError = (
  posthog: PostHog | undefined,
  error: Error | unknown,
  context?: {
    component?: string;
    action?: string;
    [key: string]: any;
  },
) => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;

  if (__DEV__) {
    console.error('[Error]', errorMessage, context);
  }

  posthog?.captureException(ANALYTICS_EVENTS.ERROR_OCCURRED, {
    error_message: errorMessage,
    error_stack: errorStack || null,
    error_type: error instanceof Error ? error.constructor.name : typeof error,
    ...context,
  });
};
