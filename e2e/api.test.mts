// Unit tests for api(): the request it makes from the page. Run with:
// yarn e2e:unit
import test from 'node:test';
import type { TestContext } from 'node:test';
import assert from 'node:assert/strict';
import type { Page } from '@playwright/test';

process.env.REACT_APP_API_URL = 'https://api.test';
// Imported after setting the URL, which api.mts reads when it loads.
const { api } = await import('./api.mts');

// Runs page.evaluate's callback here instead of in a browser. api() only ever
// calls page.evaluate, so this stands in for a whole Page.
const page = {
  evaluate: (fn: (arg: unknown) => unknown, arg: unknown) => fn(arg),
} as unknown as Page;

type Sent = { url: string; method?: string; headers: Headers; body?: unknown };

// Fakes the page's localStorage and fetch. Returns the requests made.
function browser(
  t: TestContext,
  storage: Record<string, string>,
  response: Response = Response.json([{ id: 1 }])
) {
  const sent: Sent[] = [];
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: { getItem: (key: string) => storage[key] ?? null },
  });
  t.after(() => Reflect.deleteProperty(globalThis, 'localStorage'));
  t.mock.method(
    globalThis,
    'fetch',
    async (url: string, init: RequestInit = {}) => {
      // Headers applies the same conversions fetch does to the values given.
      sent.push({ ...init, url, headers: new Headers(init.headers) });
      return response;
    }
  );
  return sent;
}

const SIGNED_IN = {
  teamId: '7',
  'access-token': 'token',
  client: 'client-id',
  uid: 'me@example.com',
};

test('sends the session headers and adds team_id to the query', async t => {
  const sent = browser(t, SIGNED_IN);
  assert.deepEqual(await api(page, 'GET', '/songs'), [{ id: 1 }]);
  assert.equal(sent.length, 1);
  const [{ url, method, headers, body }] = sent;
  assert.equal(url, 'https://api.test/songs?team_id=7');
  assert.equal(method, 'GET');
  assert.deepEqual(Object.fromEntries(headers), {
    'access-token': 'token',
    client: 'client-id',
    'content-type': 'application/json',
    uid: 'me@example.com',
  });
  assert.equal(body, undefined);
});

test('appends team_id to an existing query string', async t => {
  const sent = browser(t, SIGNED_IN);
  await api(page, 'GET', '/songs?page=2');
  assert.equal(sent[0].url, 'https://api.test/songs?page=2&team_id=7');
});

test('adds team_id to the JSON body', async t => {
  const sent = browser(t, SIGNED_IN);
  await api(page, 'POST', '/setlists', { name: 'x' });
  assert.equal(sent[0].method, 'POST');
  assert.deepEqual(JSON.parse(String(sent[0].body)), {
    name: 'x',
    team_id: '7',
  });
});

test('sends missing session values as "null"', async t => {
  const sent = browser(t, {});
  await api(page, 'GET', '/songs');
  assert.equal(sent[0].url, 'https://api.test/songs?team_id=null');
  assert.equal(sent[0].headers.get('access-token'), 'null');
  assert.equal(sent[0].headers.get('client'), 'null');
  assert.equal(sent[0].headers.get('uid'), 'null');
});

test('returns null for No Content and for a body that is not JSON', async t => {
  browser(t, SIGNED_IN, new Response(null, { status: 204 }));
  assert.equal(await api(page, 'DELETE', '/songs/1'), null);
  t.mock.restoreAll();
  browser(t, SIGNED_IN, new Response('not json'));
  assert.equal(await api(page, 'GET', '/songs'), null);
});

test('rejects with the method, path and status on an error response', async t => {
  browser(t, SIGNED_IN, new Response(null, { status: 422 }));
  await assert.rejects(api(page, 'PUT', '/songs/1', { name: '' }), {
    message: 'PUT /songs/1 -> 422',
  });
});
