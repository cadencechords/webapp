import {
  BlockArrow,
  BoldArrow,
  NarrowArrow,
  ShortArrow,
} from '../icons/markings';

export const ADD_SONGS = 'Add songs';
export const DELETE_SONGS = 'Delete songs';
export const EDIT_SONGS = 'Edit songs';

export const ADD_BINDERS = 'Add binders';
export const DELETE_BINDERS = 'Delete binders';
export const EDIT_BINDERS = 'Edit binders';

export const ADD_SETLISTS = 'Add sets';
export const DELETE_SETLISTS = 'Delete sets';
export const EDIT_SETLISTS = 'Edit sets';
export const PUBLISH_SETLISTS = 'Publish sets';

export const START_SESSIONS = 'Start sessions';

export const EDIT_TEAM = 'Edit team';
export const DELETE_TEAM = 'Delete team';

export const ADD_MEMBERS = 'Add members';
export const REMOVE_MEMBERS = 'Remove members';

export const VIEW_ROLES = 'View roles';
export const ADD_ROLES = 'Add roles';
export const EDIT_ROLES = 'Edit roles';
export const DELETE_ROLES = 'Delete roles';
export const ASSIGN_ROLES = 'Assign roles';

export const VIEW_EVENTS = 'View events';
export const EDIT_EVENTS = 'Edit events';
export const ADD_EVENTS = 'Add events';
export const DELETE_EVENTS = 'Delete events';

export const VIEW_FILES = 'View files';
export const EDIT_FILES = 'Edit files';
export const ADD_FILES = 'Add files';
export const DELETE_FILES = 'Delete files';

export const MANAGE_BILLING = 'Manage billing';

export function noop() {}

export const SPEEDS = {
  1: { px: 1, interval: 15 },
  2: { px: 1, interval: 13 },
  3: { px: 1, interval: 11 },
  4: { px: 1, interval: 9 },
  5: { px: 1, interval: 7 },
  6: { px: 1, interval: 5 },
  7: { px: 1, interval: 4 },
  8: { px: 1, interval: 3 },
  9: { px: 2, interval: 4 },
  10: { px: 3, interval: 3 },
};

export const markingTabs = ['Dynamics', 'Roadmap', 'Singers', 'Shapes'];
export const shapeOptions = {
  'block-arrow': BlockArrow,
  'bold-arrow': BoldArrow,
  'short-arrow': ShortArrow,
  'narrow-arrow': NarrowArrow,
};
