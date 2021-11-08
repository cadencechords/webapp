import * as Sentry from "@sentry/react";

export function reportError(error) {
	if (process.env.NODE_ENV === "development") {
		console.log(error);
	} else {
		Sentry.captureException(error);
	}
}
