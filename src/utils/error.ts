import * as Sentry from '@sentry/react';

export function reportError(error: unknown) {
  if (import.meta.env.DEV) {
    console.log(error);
  } else {
    Sentry.captureException(error);
  }
}
