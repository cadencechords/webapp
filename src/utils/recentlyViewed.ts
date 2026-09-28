import type { Id } from '../types';

// The songs, sets and folders a member opened last, newest first, for the
// dashboard. Kept in localStorage per team (ids belong to a team), so it
// lives only in this browser; logOut clears it.

export type RecentlyViewedType = 'song' | 'set' | 'folder';

export interface RecentlyViewedItem {
  type: RecentlyViewedType;
  id: number;
  name: string;
  /** ISO timestamp of the last visit. */
  viewedAt: string;
}

export const MAX_RECENTLY_VIEWED = 5;

const KEY_PREFIX = 'recentlyViewed:';
const TYPES: RecentlyViewedType[] = ['song', 'set', 'folder'];

export function recentlyViewedKey(teamId: Id) {
  return `${KEY_PREFIX}${teamId}`;
}

function isItem(value: unknown): value is RecentlyViewedItem {
  if (typeof value !== 'object' || value === null) return false;
  const item = value as Record<string, unknown>;
  return (
    TYPES.includes(item.type as RecentlyViewedType) &&
    typeof item.id === 'number' &&
    typeof item.name === 'string' &&
    typeof item.viewedAt === 'string'
  );
}

/** The team's items, newest first. Anything unreadable counts as none. */
export function getRecentlyViewed(teamId: Id | null | undefined) {
  if (teamId == null) return [];
  try {
    const parsed: unknown = JSON.parse(
      localStorage.getItem(recentlyViewedKey(teamId)) ?? '[]'
    );
    // Sliced too: a list saved under a higher limit can be longer.
    return Array.isArray(parsed)
      ? parsed.filter(isItem).slice(0, MAX_RECENTLY_VIEWED)
      : [];
  } catch {
    return [];
  }
}

function save(teamId: Id, items: RecentlyViewedItem[]) {
  try {
    localStorage.setItem(recentlyViewedKey(teamId), JSON.stringify(items));
  } catch {
    // Storage full or blocked: the list is a convenience, so skip it.
  }
}

/** Moves the item to the front (adding it if new), keeping the newest few. */
export function addRecentlyViewed(
  teamId: Id | null | undefined,
  item: Omit<RecentlyViewedItem, 'viewedAt'>,
  now = new Date()
) {
  if (teamId == null) return;
  const others = getRecentlyViewed(teamId).filter(
    ({ type, id }) => !(type === item.type && id === item.id)
  );
  save(
    teamId,
    [{ ...item, viewedAt: now.toISOString() }, ...others].slice(
      0,
      MAX_RECENTLY_VIEWED
    )
  );
}

/** Drops a deleted song, set or folder. */
export function removeRecentlyViewed(
  teamId: Id | null | undefined,
  type: RecentlyViewedType,
  id: Id
) {
  if (teamId == null) return;
  const items = getRecentlyViewed(teamId);
  const kept = items.filter(item => !(item.type === type && item.id === +id));
  if (kept.length !== items.length) save(teamId, kept);
}

/** Every team's list, for logging out. */
export function clearRecentlyViewed() {
  try {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(KEY_PREFIX)) keys.push(key);
    }
    keys.forEach(key => localStorage.removeItem(key));
  } catch {
    // Blocked storage has nothing to clear.
  }
}
