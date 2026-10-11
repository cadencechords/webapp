import { fireEvent, screen, waitFor } from '@testing-library/react';
import FileApi from '../api/FileApi';
import TeamApi from '../api/TeamApi';
import { setCurrentTeam } from '../store/authSlice';
import { reportError } from '../utils/error';
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

beforeEach(() => {
  vi.clearAllMocks();
});

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

test('lets editors turn automatic roadmaps off and on', async () => {
  const { store } = renderPage({ permissions: ['Edit team'] });
  const toggle = screen.getByRole('switch', { name: /Automatic roadmaps/ });
  expect(toggle).toHaveAccessibleName(/get a roadmap from their sections/);
  // On when the team doesn't say: the API's default.
  expect(toggle).toBeChecked();

  fireEvent.click(toggle);
  expect(toggle).not.toBeChecked();
  await waitFor(() =>
    expect(TeamApi.update).toHaveBeenCalledWith({ auto_roadmaps: false })
  );
  await waitFor(() =>
    expect(store.getState().auth.currentTeam?.auto_roadmaps).toBe(false)
  );

  fireEvent.click(toggle);
  expect(toggle).toBeChecked();
  await waitFor(() =>
    expect(TeamApi.update).toHaveBeenLastCalledWith({ auto_roadmaps: true })
  );
});

test('shows automatic roadmaps off when the team turned them off', () => {
  renderPage({ currentTeam: { ...team, auto_roadmaps: false } });
  expect(
    screen.getByRole('switch', { name: /Automatic roadmaps/ })
  ).not.toBeChecked();
});

test("doesn't let members without Edit team change automatic roadmaps", () => {
  renderPage();
  const toggle = screen.getByRole('switch', { name: /Automatic roadmaps/ });
  expect(toggle).toBeDisabled();

  fireEvent.click(toggle);
  fireEvent.click(screen.getByText('Automatic roadmaps'));
  expect(toggle).toBeChecked();
  expect(TeamApi.update).not.toHaveBeenCalled();
});

test('turns automatic roadmaps back when saving fails', async () => {
  const error = new Error('Network Error');
  vi.mocked(TeamApi.update).mockRejectedValueOnce(error);
  const { store } = renderPage({ permissions: ['Edit team'] });
  const toggle = screen.getByRole('switch', { name: /Automatic roadmaps/ });

  fireEvent.click(toggle);
  expect(toggle).not.toBeChecked();
  await waitFor(() => expect(reportError).toHaveBeenCalledWith(error));
  expect(toggle).toBeChecked();
  expect(store.getState().auth.currentTeam?.auto_roadmaps).toBeUndefined();
});

test('ignores automatic roadmaps clicks while a save is in flight', async () => {
  let rejectSave!: (error: Error) => void;
  vi.mocked(TeamApi.update).mockReturnValueOnce(
    new Promise((_resolve, reject) => {
      rejectSave = reject;
    })
  );
  renderPage({ permissions: ['Edit team'] });
  const toggle = screen.getByRole('switch', { name: /Automatic roadmaps/ });

  fireEvent.click(toggle);
  fireEvent.click(toggle);
  expect(toggle).not.toBeChecked();
  await waitFor(() => expect(TeamApi.update).toHaveBeenCalled());
  expect(TeamApi.update).toHaveBeenCalledTimes(1);

  rejectSave(new Error('Network Error'));
  await waitFor(() => expect(toggle).toBeChecked());
});

test('turning automatic roadmaps back keeps a rename made meanwhile', async () => {
  let rejectSave!: (error: Error) => void;
  vi.mocked(TeamApi.update).mockReturnValueOnce(
    new Promise((_resolve, reject) => {
      rejectSave = reject;
    })
  );
  const { store } = renderPage({ permissions: ['Edit team'] });

  fireEvent.click(screen.getByRole('switch', { name: /Automatic roadmaps/ }));
  store.dispatch(
    setCurrentTeam({ ...team, auto_roadmaps: false, name: 'Band' })
  );
  rejectSave(new Error('Network Error'));

  await waitFor(() => expect(reportError).toHaveBeenCalled());
  expect(store.getState().auth.currentTeam).toMatchObject({
    name: 'Band',
    auto_roadmaps: undefined,
  });
});

test("doesn't turn automatic roadmaps back on another team", async () => {
  let rejectSave!: (error: Error) => void;
  vi.mocked(TeamApi.update).mockReturnValueOnce(
    new Promise((_resolve, reject) => {
      rejectSave = reject;
    })
  );
  const { store } = renderPage({ permissions: ['Edit team'] });
  const otherTeam: Team = { id: 9, name: 'Choir', auto_roadmaps: false };

  fireEvent.click(screen.getByRole('switch', { name: /Automatic roadmaps/ }));
  store.dispatch(setCurrentTeam(otherTeam));
  rejectSave(new Error('Network Error'));

  await waitFor(() => expect(reportError).toHaveBeenCalled());
  expect(store.getState().auth.currentTeam).toEqual(otherTeam);
});
