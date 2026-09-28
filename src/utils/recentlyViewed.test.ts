import {
  MAX_RECENTLY_VIEWED,
  addRecentlyViewed,
  clearRecentlyViewed,
  getRecentlyViewed,
  recentlyViewedKey,
  removeRecentlyViewed,
} from './recentlyViewed';

beforeEach(() => {
  localStorage.clear();
});

const song = (id: number, name = `Song ${id}`) =>
  ({ type: 'song', id, name }) as const;

test('adds items newest first, with when they were viewed', () => {
  addRecentlyViewed(1, song(1), new Date('2026-09-01T10:00:00Z'));
  addRecentlyViewed(1, { type: 'set', id: 2, name: 'Sunday AM' });

  const items = getRecentlyViewed(1);
  expect(items.map(item => item.name)).toEqual(['Sunday AM', 'Song 1']);
  expect(items[1]).toEqual({
    type: 'song',
    id: 1,
    name: 'Song 1',
    viewedAt: '2026-09-01T10:00:00.000Z',
  });
});

test('viewing an item again moves it to the front with its latest name', () => {
  addRecentlyViewed(1, song(1));
  addRecentlyViewed(1, song(2));
  addRecentlyViewed(1, song(1, 'Renamed'));

  expect(getRecentlyViewed(1).map(({ id, name }) => [id, name])).toEqual([
    [1, 'Renamed'],
    [2, 'Song 2'],
  ]);
});

test('a song and a set with the same id are different items', () => {
  addRecentlyViewed(1, song(3));
  addRecentlyViewed(1, { type: 'set', id: 3, name: 'Set 3' });

  expect(getRecentlyViewed(1)).toHaveLength(2);
});

test(`keeps only the newest ${MAX_RECENTLY_VIEWED}`, () => {
  for (let id = 1; id <= MAX_RECENTLY_VIEWED + 2; id++) {
    addRecentlyViewed(1, song(id));
  }

  const ids = getRecentlyViewed(1).map(item => item.id);
  expect(ids).toHaveLength(MAX_RECENTLY_VIEWED);
  expect(ids[0]).toBe(MAX_RECENTLY_VIEWED + 2);
  expect(ids).not.toContain(1);
  expect(ids).not.toContain(2);
});

test(`shows at most ${MAX_RECENTLY_VIEWED} from a list saved under a higher limit`, () => {
  localStorage.setItem(
    recentlyViewedKey(1),
    JSON.stringify(
      Array.from({ length: 8 }, (_, i) => ({
        ...song(i + 1),
        viewedAt: '2026-09-01',
      }))
    )
  );

  expect(getRecentlyViewed(1).map(item => item.id)).toEqual([1, 2, 3, 4, 5]);
});

test('keeps each team’s list apart, whether its id is a number or a string', () => {
  addRecentlyViewed(1, song(1));
  addRecentlyViewed(2, song(2));

  expect(getRecentlyViewed(1).map(item => item.id)).toEqual([1]);
  // localStorage hands the team id back as a string.
  expect(getRecentlyViewed('2').map(item => item.id)).toEqual([2]);
});

test('does nothing without a team', () => {
  addRecentlyViewed(undefined, song(1));
  addRecentlyViewed(null, song(1));

  expect(localStorage.length).toBe(0);
  expect(getRecentlyViewed(undefined)).toEqual([]);
});

test('removes a deleted item, by a numeric or a string id', () => {
  addRecentlyViewed(1, song(1));
  addRecentlyViewed(1, song(2));
  addRecentlyViewed(1, { type: 'folder', id: 2, name: 'Hymns' });

  removeRecentlyViewed(1, 'song', '2');
  expect(getRecentlyViewed(1).map(({ type, id }) => [type, id])).toEqual([
    ['folder', 2],
    ['song', 1],
  ]);

  removeRecentlyViewed(1, 'folder', 2);
  expect(getRecentlyViewed(1).map(({ type, id }) => [type, id])).toEqual([
    ['song', 1],
  ]);
});

test('reads unparseable or malformed storage as empty, skipping bad items', () => {
  localStorage.setItem(recentlyViewedKey(1), '{not json');
  expect(getRecentlyViewed(1)).toEqual([]);

  localStorage.setItem(recentlyViewedKey(1), '{"type":"song"}');
  expect(getRecentlyViewed(1)).toEqual([]);

  localStorage.setItem(
    recentlyViewedKey(1),
    JSON.stringify([
      { type: 'song', id: 1, name: 'Good', viewedAt: '2026-09-01' },
      { type: 'member', id: 2, name: 'Unknown type', viewedAt: '2026-09-01' },
      { type: 'set', id: '3', name: 'String id', viewedAt: '2026-09-01' },
      null,
    ])
  );
  expect(getRecentlyViewed(1).map(item => item.name)).toEqual(['Good']);

  // Adding over bad data starts a clean list.
  localStorage.setItem(recentlyViewedKey(1), '{not json');
  addRecentlyViewed(1, song(4));
  expect(getRecentlyViewed(1).map(item => item.id)).toEqual([4]);
});

test('carries on when storage refuses the write', () => {
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new DOMException('Quota exceeded', 'QuotaExceededError');
  });

  expect(() => addRecentlyViewed(1, song(1))).not.toThrow();
  vi.restoreAllMocks();
  expect(getRecentlyViewed(1)).toEqual([]);
});

test('clearing removes every team’s list and nothing else', () => {
  addRecentlyViewed(1, song(1));
  addRecentlyViewed(2, song(2));
  localStorage.setItem('theme', 'dark');

  clearRecentlyViewed();

  expect(getRecentlyViewed(1)).toEqual([]);
  expect(getRecentlyViewed(2)).toEqual([]);
  expect(localStorage.getItem('theme')).toBe('dark');
});
