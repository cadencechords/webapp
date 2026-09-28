import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectTeamId } from '../store/authSlice';
import {
  addRecentlyViewed,
  getRecentlyViewed,
  recentlyViewedKey,
  type RecentlyViewedType,
} from '../utils/recentlyViewed';

/** The current team's recently viewed items, kept in step with other tabs. */
export function useRecentlyViewed() {
  const teamId = useSelector(selectTeamId);
  // Bumped to re-read storage when another tab changes it.
  const [, setVersion] = useState(0);

  useEffect(() => {
    if (teamId == null) return;

    const key = recentlyViewedKey(teamId);
    function handleStorage(event: StorageEvent) {
      // A null key: another tab cleared all of localStorage.
      if (event.key === key || event.key === null) {
        setVersion(version => version + 1);
      }
    }
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [teamId]);

  // A small localStorage read, so done on every render.
  return getRecentlyViewed(teamId);
}

/**
 * Records a visit to a song, set or folder once it has loaded, and again
 * when it's renamed.
 */
export function useRecordRecentlyViewed(
  type: RecentlyViewedType,
  viewed: { id?: number; name?: string } | null | undefined
) {
  const teamId = useSelector(selectTeamId);
  const id = viewed?.id;
  const name = viewed?.name;

  useEffect(() => {
    if (id == null || !name) return;
    addRecentlyViewed(teamId, { type, id, name });
  }, [teamId, type, id, name]);
}
