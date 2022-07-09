import useAuth from './useAuth';
import { screen } from '@testing-library/react';
import { renderWithProvider } from '../utils/test';

function TestComponent() {
  const { credentials, hasCredentials, currentUser, refreshCurrentUser } =
    useAuth();

  return (
    <>
      <div>{credentials.accessToken}</div>
      <div>{credentials.client}</div>
      <div>{credentials.uid}</div>
      <div>{hasCredentials ? 'true' : 'false'}</div>

      <button aria-label="refresh user" onClick={refreshCurrentUser}>
        refresh user
      </button>

      <div>{currentUser?.first_name}</div>
      <div>{currentUser?.last_name}</div>
      <div>{currentUser?.email}</div>
    </>
  );
}

test('it should return populated credentials when stored in local storage', async () => {
  renderWithProvider(<TestComponent />, {
    preloadedState,
  });

  await screen.findByText('ACCESS_TOKEN');
  await screen.findByText('CLIENT');
  await screen.findByText('UID');
});

const preloadedState = {
  auth: {
    accessToken: 'ACCESS_TOKEN',
    client: 'CLIENT',
    uid: 'UID',
  },
};
