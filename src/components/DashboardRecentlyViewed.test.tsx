import { act, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProvider } from '../utils/test';
import Dashboard from './Dashboard';
import { useRecordRecentlyViewed } from '../hooks/useRecentlyViewed';
import { logOut } from '../store/authSlice';
import {
  addRecentlyViewed,
  getRecentlyViewed,
  recentlyViewedKey,
  type RecentlyViewedType,
} from '../utils/recentlyViewed';

beforeEach(() => {
  localStorage.clear();
});

const TEAM_ID = 5;
const team = { auth: { teamId: TEAM_ID } };

function renderDashboard(data = { todays_setlists: [] }) {
  return renderWithProvider(
    <MemoryRouter>
      <Dashboard data={data} />
    </MemoryRouter>,
    { preloadedState: team }
  );
}

test('lists recently viewed songs, sets and folders newest first, linking to each', () => {
  addRecentlyViewed(TEAM_ID, { type: 'song', id: 1, name: 'Amazing Grace' });
  addRecentlyViewed(TEAM_ID, { type: 'folder', id: 2, name: 'Hymns' });
  addRecentlyViewed(TEAM_ID, { type: 'set', id: 3, name: 'Sunday AM' });

  renderDashboard();

  expect(screen.getByText('Recently viewed')).toBeInTheDocument();
  const links = screen
    .getAllByRole('link')
    .filter(link => !link.getAttribute('href')?.includes('present'));
  expect(links.map(link => link.getAttribute('href'))).toEqual([
    '/sets/3',
    '/folders/2',
    '/songs/1',
  ]);
  expect(links.map(link => link.textContent)).toEqual([
    'Sunday AMSet',
    'HymnsFolder',
    'Amazing GraceSong',
  ]);
});

test('hides the section until something has been viewed', () => {
  renderDashboard();

  expect(screen.queryByText('Recently viewed')).not.toBeInTheDocument();
  expect(
    screen.getByText('No sets are scheduled for today')
  ).toBeInTheDocument();
});

test('shows only the current team’s items', () => {
  addRecentlyViewed(TEAM_ID, { type: 'song', id: 1, name: 'Ours' });
  addRecentlyViewed(99, { type: 'song', id: 2, name: 'Another team’s' });

  renderDashboard();

  expect(screen.getByText('Ours')).toBeInTheDocument();
  expect(screen.queryByText('Another team’s')).not.toBeInTheDocument();
});

test('still shows recently viewed when the dashboard data didn’t load', () => {
  addRecentlyViewed(TEAM_ID, { type: 'song', id: 1, name: 'Amazing Grace' });

  renderWithProvider(
    <MemoryRouter>
      <Dashboard data={undefined} />
    </MemoryRouter>,
    { preloadedState: team }
  );

  expect(screen.getByText('Amazing Grace')).toBeInTheDocument();
  expect(screen.queryByText("Today's sets")).not.toBeInTheDocument();
});

test('picks up a visit recorded in another tab', () => {
  renderDashboard();
  expect(screen.queryByText('Recently viewed')).not.toBeInTheDocument();

  addRecentlyViewed(TEAM_ID, { type: 'set', id: 3, name: 'Sunday AM' });
  act(() => {
    window.dispatchEvent(
      new StorageEvent('storage', { key: recentlyViewedKey(TEAM_ID) })
    );
  });

  expect(screen.getByText('Sunday AM')).toBeInTheDocument();
});

function Visit({
  type,
  viewed,
}: {
  type: RecentlyViewedType;
  viewed?: { id: number; name: string };
}) {
  useRecordRecentlyViewed(type, viewed);
  return null;
}

test('useRecordRecentlyViewed records a visit once loaded, and again on rename', () => {
  const { rerender } = renderWithProvider(<Visit type="song" />, {
    preloadedState: team,
  });
  expect(getRecentlyViewed(TEAM_ID)).toEqual([]);

  rerender(<Visit type="song" viewed={{ id: 1, name: 'Amazing Grace' }} />);
  rerender(<Visit type="set" viewed={{ id: 3, name: 'Sunday AM' }} />);
  rerender(<Visit type="set" viewed={{ id: 3, name: 'Sunday PM' }} />);

  expect(
    getRecentlyViewed(TEAM_ID).map(({ type, id, name }) => [type, id, name])
  ).toEqual([
    ['set', 3, 'Sunday PM'],
    ['song', 1, 'Amazing Grace'],
  ]);
});

test('logging out clears recently viewed', () => {
  addRecentlyViewed(TEAM_ID, { type: 'song', id: 1, name: 'Amazing Grace' });
  const { store } = renderWithProvider(<div />, { preloadedState: team });

  store.dispatch(logOut());

  expect(getRecentlyViewed(TEAM_ID)).toEqual([]);
});
