// Every screen the screenshot catalog visits. `:song`, `:set`, etc. are filled
// in at runtime with IDs from the signed-in test team (see discoverIds in catalog.spec.mts).

export type Route = { name: string; path: string; skip?: string };
// IDs by param name; null (or missing) when the test team has none.
export type Ids = Record<string, string | number | null | undefined>;

export const PUBLIC_ROUTES: Route[] = [
  { name: 'login', path: '/login' },
  { name: 'signup', path: '/signup' },
  { name: 'forgot-password', path: '/forgot_password' },
];

export const AUTHED_ROUTES: Route[] = [
  { name: 'team-picker', path: '/login/teams' },
  { name: 'team-new', path: '/login/teams/new' },
  { name: 'dashboard', path: '/' },
  { name: 'search', path: '/search' },
  { name: 'songs', path: '/songs' },
  { name: 'song-detail', path: '/songs/:song' },
  { name: 'song-edit', path: '/songs/:song/edit' },
  { name: 'song-present', path: '/songs/:song/present' },
  { name: 'sets', path: '/sets' },
  { name: 'set-detail', path: '/sets/:set' },
  { name: 'set-present', path: '/sets/:set/present' },
  { name: 'binders', path: '/binders' },
  { name: 'binder-detail', path: '/binders/:binder' },
  { name: 'calendar', path: '/calendar' },
  { name: 'calendar-new', path: '/calendar/new' },
  { name: 'calendar-edit', path: '/calendar/:event/edit' },
  { name: 'chat', path: '/chat' },
  { name: 'import', path: '/import' },
  { name: 'import-files', path: '/import/files' },
  { name: 'import-onsong', path: '/import/onsong' },
  { name: 'import-planning-center', path: '/import/planning-center' },
  { name: 'import-cadence', path: '/import/cadence' },
  { name: 'team', path: '/team' },
  { name: 'members', path: '/members' },
  { name: 'member-detail', path: '/members/:member' },
  { name: 'permissions', path: '/permissions' },
  { name: 'role-detail', path: '/permissions/:role' },
  { name: 'account', path: '/account' },
  { name: 'account-settings', path: '/account/settings' },
  { name: 'account-appearance', path: '/account/appearance' },
  { name: 'account-profile', path: '/account/profile' },
  { name: 'account-notifications', path: '/account/notifications' },
  { name: 'billing', path: '/billing' },
];

export const VARIANTS: {
  name: string;
  viewport: { width: number; height: number };
  theme: string;
}[] = [
  {
    name: 'desktop-light',
    viewport: { width: 1280, height: 800 },
    theme: 'light',
  },
  {
    name: 'desktop-dark',
    viewport: { width: 1280, height: 800 },
    theme: 'dark',
  },
  {
    name: 'mobile-light',
    viewport: { width: 390, height: 844 },
    theme: 'light',
  },
  { name: 'mobile-dark', viewport: { width: 390, height: 844 }, theme: 'dark' },
];

// Fills `:param` placeholders from `ids`. Routes whose IDs are missing come back
// with `skip` set, so the catalog reports them instead of screenshotting a 404.
export function resolveRoutes(routes: Route[], ids: Ids): Route[] {
  return routes.map(route => {
    const missing: string[] = [];
    const path = route.path.replace(/:(\w+)/g, (_, key: string) => {
      if (ids[key] == null) {
        missing.push(key);
        return `:${key}`;
      }
      return encodeURIComponent(ids[key]);
    });
    return missing.length
      ? { ...route, path, skip: `test team has no ${missing.join(', ')}` }
      : { ...route, path };
  });
}
