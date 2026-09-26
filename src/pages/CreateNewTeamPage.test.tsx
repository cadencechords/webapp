import { fireEvent, screen } from '@testing-library/react';
import { MemoryRouter, useHistory } from 'react-router-dom';
import { renderWithProvider } from '../utils/test';
import CreateNewTeamPage from './CreateNewTeamPage';

/** Opens `to`, standing in for a link to another plan. */
function Go({ to }: { to: string }) {
  const history = useHistory();
  return <button onClick={() => history.push(to)}>{`Go ${to}`}</button>;
}

function isSelected(planName: string) {
  return screen
    .getByText(planName, { selector: '.uppercase' })
    .closest('.rounded-md')!
    .classList.contains('border-blue-500');
}

test.each([
  ['?requested_plan=Pro', 'Pro'],
  ['?requested_plan=Starter', 'Starter'],
  ['?requested_plan=Enterprise', 'Starter'],
  ['', 'Starter'],
])('with %j it selects %s', (search, plan) => {
  renderWithProvider(
    <MemoryRouter initialEntries={[`/teams/new${search}`]}>
      <CreateNewTeamPage />
    </MemoryRouter>
  );
  expect(isSelected(plan)).toBe(true);
  expect(isSelected(plan === 'Pro' ? 'Starter' : 'Pro')).toBe(false);
});

test('a picked plan stays until the URL requests another', () => {
  renderWithProvider(
    <MemoryRouter initialEntries={['/teams/new?requested_plan=Pro']}>
      <CreateNewTeamPage />
      <Go to="/teams/new?requested_plan=Pro&from=pricing" />
      <Go to="/teams/new?requested_plan=Starter" />
    </MemoryRouter>
  );
  fireEvent.click(screen.getByText('Starter', { selector: '.uppercase' }));
  expect(isSelected('Starter')).toBe(true);

  // The same requested plan: the pick stays.
  fireEvent.click(
    screen.getByText('Go /teams/new?requested_plan=Pro&from=pricing')
  );
  expect(isSelected('Starter')).toBe(true);

  fireEvent.click(screen.getByText('Pro', { selector: '.uppercase' }));
  fireEvent.click(screen.getByText('Go /teams/new?requested_plan=Starter'));
  expect(isSelected('Starter')).toBe(true);
});
