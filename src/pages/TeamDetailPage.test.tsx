import { fireEvent, screen, waitFor } from '@testing-library/react';
import FileApi from '../api/FileApi';
import { renderWithProvider } from '../utils/test';
import TeamDetailPage from './TeamDetailPage';
import type { Subscription, Team } from '../types';

vi.mock('../api/FileApi');
vi.mock('../api/TeamApi');
vi.mock('../utils/error');
vi.mock('../hooks/api/formatPresets.hooks', () => ({
  useFormatPresets: () => ({
    data: [{ id: 4, name: 'Big chords' }],
    error: null,
  }),
  useSetDefaultFormat: () => ({ run: () => {}, isLoading: false }),
}));

const team: Team = {
  id: 3,
  name: 'Worship team',
  created_at: '2022-07-02T12:00:00',
  image_url: 'team.png',
};

function renderPage({
  permissions = [] as string[],
  subscription = { plan_name: 'Pro', isPro: false } as Subscription,
  currentTeam = team,
} = {}) {
  return renderWithProvider(<TeamDetailPage />, {
    preloadedState: {
      auth: {
        currentTeam,
        currentUser: {
          id: 1,
          email: 'me@example.com',
          role: {
            id: 1,
            name: 'Admin',
            permissions: permissions.map(name => ({ name })),
          },
        },
      },
      subscription: { subscription },
    },
  });
}

test('shows the team on a card and its details as a segmented list', () => {
  renderPage();
  const name = screen.getByRole('heading', { name: 'Worship team' });
  expect(name.closest('section')).toHaveClass('rounded-extra-large-increased');
  const created = screen.getByText('Created').closest('.list-segmented > *')!;
  expect(created.parentElement).toHaveClass('list-segmented');
  expect(created).toHaveTextContent('Jul 2, 2022');
  expect(
    screen.getByText('Plan').closest('div')!.parentElement
  ).toHaveTextContent('Pro');
  // No photo buttons without permission to edit the team.
  expect(
    screen.queryByRole('button', { name: /photo/ })
  ).not.toBeInTheDocument();
});

test('marks a trial', () => {
  renderPage({
    subscription: {
      plan_name: 'Pro',
      status: 'trialing',
      isPro: false,
    } as Subscription,
  });
  expect(screen.getByText('Trial')).toHaveClass('bg-tertiary-container');
});

test('lets editors change and remove the photo', async () => {
  vi.mocked(FileApi.deleteTeamImage).mockResolvedValue(
    // `as`: the page ignores the response.
    {} as Awaited<ReturnType<typeof FileApi.deleteTeamImage>>
  );
  const { store } = renderPage({ permissions: ['Edit team'] });
  expect(
    screen.getByRole('button', { name: 'Change photo' })
  ).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Remove' }));
  await waitFor(() =>
    expect(store.getState().auth.currentTeam?.image_url).toBeNull()
  );
  expect(FileApi.deleteTeamImage).toHaveBeenCalled();
  expect(screen.getByRole('button', { name: 'Add photo' })).toBeInTheDocument();
  expect(
    screen.queryByRole('button', { name: 'Remove' })
  ).not.toBeInTheDocument();
});

test('shows the format presets as selectable cards on Pro', () => {
  renderPage({
    subscription: { plan_name: 'Pro', isPro: true } as Subscription,
    currentTeam: { ...team, default_format: { id: 4, name: 'Big chords' } },
  });
  expect(
    screen.getByRole('heading', { name: 'Format presets' })
  ).toBeInTheDocument();
  const preset = screen.getByRole('button', { name: /Big chords/ });
  expect(preset).toHaveAttribute('aria-pressed', 'true');
  expect(preset).toHaveTextContent('Default');
});
