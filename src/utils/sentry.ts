import * as Sentry from '@sentry/react-native';

const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;

let initialized = false;

export function initSentry() {
  if (initialized || !dsn) return;
  initialized = true;

  Sentry.init({
    dsn,
    // __DEV__에서 true면 console.warn/error → LogBox "Console Error" + errorForStackTrace 노이즈
    debug: process.env.EXPO_PUBLIC_SENTRY_DEBUG === '1',
  });
}

export { Sentry };
