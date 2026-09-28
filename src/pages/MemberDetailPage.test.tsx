import { screen, within } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import MemberDetailPage from './MemberDetailPage';
import UserApi from '../api/UserApi';
import { renderWithProvider } from '../utils/test';

vi.mock('../api/UserApi');
vi.mock('../utils/error');

const currentUser = {
  id: 7,
  email: 'me@example.com',
  role: { permissions: [] },
};

function renderPage(permissions: { name: string }[] = []) {
  renderWithProvider(
    <MemoryRouter initialEntries={['/members/3']}>
      <Route path="/members/:id">
        <MemberDetailPage />
      </Route>
    </MemoryRouter>,
    {
      preloadedState: {
        auth: { currentUser: { ...currentUser, role: { permissions } } },
      },
    }
  );
}

test('shows the member once loaded', async () => {
  vi.mocked(UserApi.getMember).mockResolvedValueOnce({
    data: { id: 3, email: 'member@example.com', created_at: '2022-07-02' },
  } as Awaited<ReturnType<typeof UserApi.getMember>>);
  renderPage();

  expect(await screen.findByText('member@example.com')).toBeInTheDocument();
});

test('shows the profile on a card and the details as a list', async () => {
  vi.mocked(UserApi.getMember).mockResolvedValueOnce({
    data: {
      id: 3,
      email: 'sam@example.com',
      first_name: 'Sam',
      last_name: 'Lee',
      position: 'Drums',
      created_at: '2022-07-02',
    },
  } as Awaited<ReturnType<typeof UserApi.getMember>>);
  renderPage();

  const name = await screen.findByRole('heading', { name: 'Sam Lee' });
  const card = name.closest('section')!;
  expect(card).toHaveClass('rounded-extra-large-increased');
  expect(within(card).getByText('sam@example.com')).toBeInTheDocument();

  const position = screen.getByText('Drums').closest('.list-segmented > *')!;
  expect(position.parentElement).toHaveClass('list-segmented');
  expect(position).toHaveTextContent('Position');
  expect(screen.getByText('Joined')).toBeInTheDocument();
  // No member actions without permission to remove members.
  expect(
    screen.queryByRole('button', { name: 'Manage member' })
  ).not.toBeInTheDocument();
});

test('says what the member hasn’t filled in, and offers actions to admins', async () => {
  vi.mocked(UserApi.getMember).mockResolvedValueOnce({
    data: { id: 3, email: 'member@example.com', created_at: '2022-07-02' },
  } as Awaited<ReturnType<typeof UserApi.getMember>>);
  renderPage([{ name: 'Remove members' }]);

  expect(
    await screen.findByRole('heading', { name: 'member@example.com' })
  ).toBeInTheDocument();
  expect(screen.getByText('No name provided yet')).toBeInTheDocument();
  expect(screen.getByText('No position provided yet')).toBeInTheDocument();
  expect(
    screen.getByRole('button', { name: 'Manage member' })
  ).toBeInTheDocument();
});

// Used to crash reading `member.email` when the request failed (CAD-123).
test('shows an error when the member fails to load', async () => {
  vi.mocked(UserApi.getMember).mockRejectedValueOnce(new Error('Not found'));
  renderPage();

  expect(
    await screen.findByText(/unable to load this member/i)
  ).toBeInTheDocument();
});
