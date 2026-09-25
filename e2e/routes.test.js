// Unit tests for the route list. Run with: node --test e2e/
const test = require('node:test');
const assert = require('node:assert');
const { AUTHED_ROUTES, PUBLIC_ROUTES, resolveRoutes } = require('./routes');

test('fills params from ids', () => {
  const [route] = resolveRoutes([{ name: 'x', path: '/songs/:song/edit' }], {
    song: 42,
  });
  assert.deepStrictEqual(route, { name: 'x', path: '/songs/42/edit' });
});

test('marks routes with missing ids as skipped', () => {
  const [route] = resolveRoutes([{ name: 'x', path: '/sets/:set' }], {});
  assert.strictEqual(route.skip, 'test team has no set');
});

test('leaves static routes alone', () => {
  const [route] = resolveRoutes([{ name: 'x', path: '/songs' }], {});
  assert.deepStrictEqual(route, { name: 'x', path: '/songs' });
});

test('route names are unique (they become file names)', () => {
  const names = [...PUBLIC_ROUTES, ...AUTHED_ROUTES].map(r => r.name);
  assert.strictEqual(new Set(names).size, names.length);
});

test('every param used by a route is one the catalog discovers', () => {
  const discovered = ['song', 'set', 'binder', 'event', 'member', 'role'];
  for (const { path } of AUTHED_ROUTES) {
    for (const [, key] of path.matchAll(/:(\w+)/g))
      assert.ok(discovered.includes(key), `${path} uses :${key}`);
  }
});
