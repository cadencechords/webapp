import { screen } from '@testing-library/react';
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

function renderPage() {
  renderWithProvider(
    <MemoryRouter initialEntries={['/members/3']}>
      <Route path="/members/:id">
        <MemberDetailPage />
      </Route>
    </MemoryRouter>,
    { preloadedState: { auth: { currentUser } } }
  );
}

test('shows the member once loaded', async () => {
  vi.mocked(UserApi.getMember).mockResolvedValueOnce({
    data: { id: 3, email: 'member@example.com', created_at: '2022-07-02' },
  } as Awaited<ReturnType<typeof UserApi.getMember>>);
  renderPage();

  expect(await screen.findByText('member@example.com')).toBeInTheDocument();
});

// Used to crash reading `member.email` when the request failed (CAD-123).
test('shows an error when the member fails to load', async () => {
  vi.mocked(UserApi.getMember).mockRejectedValueOnce(new Error('Not found'));
  renderPage();

  expect(
    await screen.findByText(/unable to load this member/i)
  ).toBeInTheDocument();
});
