export const IDLE = 'idle';
export const RESOLVED = 'resolved';
export const ERRORED = 'errored';
export const LOADING = 'loading';

/** The state of a request a component tracks with `useState`. */
export type RequestStatus =
  | typeof IDLE
  | typeof RESOLVED
  | typeof ERRORED
  | typeof LOADING;
