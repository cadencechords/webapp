import { screen } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import JoinLinkPage from './JoinLinkPage';
import axios from 'axios';
import { renderWithProvider } from '../utils/test';

vi.mock('axios');

test('it should display join details if join link is valid', async () => {
  mockSuccessfulAxiosResponse();
  renderWithRouter(<JoinLinkPage />, { auth: { currentUser } });

  await screen.findByText(/pro plan/i);
});

test('it should ask a logged-out user to log in first', async () => {
  mockSuccessfulAxiosResponse();
  renderWithRouter(<JoinLinkPage />);

  await screen.findByText(/you need to be logged in first/i);
});

test('it should display an alert if the join link is invalid', async () => {
  mockFailedAxiosResponse();
  renderWithRouter(<JoinLinkPage />);

  await screen.findByText(/we were unable to find a team with this link/i);
});

function renderWithRouter(component, preloadedState) {
  renderWithProvider(
    <MemoryRouter initialEntries={['/join/12345']}>
      <Route path="/join/:code">{component}</Route>
    </MemoryRouter>,
    { preloadedState }
  );
}

function mockSuccessfulAxiosResponse() {
  axios.create.mockReturnValueOnce(axios);
  axios.get.mockResolvedValueOnce({ data: team });
}

function mockFailedAxiosResponse() {
  axios.create.mockReturnValueOnce(axios);
  axios.get.mockRejectedValueOnce({ response: { data: 'Does not exist' } });
}

const currentUser = { id: 7, email: 'someone@example.com' };

const team = {
  id: 1,
  name: 'Pro Plan',
  created_at: '2022-07-02T13:42:21.716Z',
  updated_at: '2022-07-03T00:44:02.424Z',
  join_link: '6a470bd69026a5da35e4',
  join_link_enabled: true,
};
