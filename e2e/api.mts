// Calls the API from inside a page that is on the app origin, with the
// session's own auth headers. team_id is added to the query and the body.
// T is the shape of the JSON the endpoint returns (null for 204 No Content).
/// <reference lib="dom" />
import type { Page } from '@playwright/test';

const API_URL = process.env.REACT_APP_API_URL;

export function api<T = unknown>(
  page: Page,
  method: string,
  path: string,
  body?: Record<string, unknown>
): Promise<T> {
  return page.evaluate(
    async ({ apiUrl, method, path, body }) => {
      const team = localStorage.getItem('teamId');
      const url = `${apiUrl}${path}${path.includes('?') ? '&' : '?'}team_id=${team}`;
      const res = await fetch(url, {
        method,
        // fetch sends a missing (null) value as "null"; String() spells that out.
        headers: {
          'content-type': 'application/json',
          'access-token': String(localStorage.getItem('access-token')),
          client: String(localStorage.getItem('client')),
          uid: String(localStorage.getItem('uid')),
        },
        ...(body && { body: JSON.stringify({ ...body, team_id: team }) }),
      });
      if (!res.ok) throw new Error(`${method} ${path} -> ${res.status}`);
      return res.status === 204 ? null : res.json().catch(() => null);
    },
    { apiUrl: API_URL, method, path, body }
  );
}
