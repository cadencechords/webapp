import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProvider } from '../utils/test';
import { MANAGE_BILLING, VIEW_EVENTS, VIEW_ROLES } from '../utils/constants';
import NavigationRail from './NavigationRail';
import NavigationRailItem, { pulse } from './NavigationRailItem';

function state(permissions: string[], isPro = true) {
  return {
    auth: {
      currentUser: {
        id: 1,
        email: 'me@example.com',
        role: {
          id: 1,
          name: 'Admin',
          permissions: permissions.map(name => ({ name })),
        },
      },
      currentTeam: { id: 1, name: 'Worship team' },
    },
    subscription: { subscription: { isPro } },
  };
}

function renderRail(path: string, permissions: string[], isPro = true) {
  return renderWithProvider(
    <MemoryRouter initialEntries={[path]}>
      <NavigationRail />
    </MemoryRouter>,
    { preloadedState: state(permissions, isPro) }
  );
}

const nav = () => screen.getByRole('navigation', { name: 'Main' });
const link = (name: string) => within(nav()).getByRole('link', { name });
const indicator = (name: string) =>
  link(name).querySelector('[data-rail-indicator]');

test('the rail lists every destination, in order, under the team and account', () => {
  renderRail('/', [VIEW_EVENTS, VIEW_ROLES, MANAGE_BILLING]);
  expect(
    within(nav())
      .getAllByRole('link')
      .map(a => [a.textContent, a.getAttribute('href')])
  ).toEqual([
    ['Search', '/search'],
    ['Dashboard', '/'],
    ['Songs', '/songs'],
    ['Sets', '/sets'],
    ['Folders', '/folders'],
    ['Team members', '/members'],
    ['Calendar', '/calendar'],
    ['Permissions', '/permissions'],
    ['Billing', '/billing'],
  ]);
  const team = within(nav()).getByRole('button', { name: /Worship team/ });
  expect(
    team.compareDocumentPosition(link('Search')) &
      Node.DOCUMENT_POSITION_FOLLOWING
  ).toBeTruthy();
});

test('the rail hides what the member or plan can’t use', () => {
  renderRail('/', [VIEW_EVENTS], false);
  for (const name of ['Calendar', 'Permissions', 'Billing'])
    expect(within(nav()).queryByRole('link', { name })).not.toBeInTheDocument();
  expect(within(nav()).queryByRole('separator')).not.toBeInTheDocument();
});

test('the current destination is marked and shows its indicator', () => {
  renderRail('/songs/12', []);
  expect(link('Songs')).toHaveAttribute('aria-current', 'page');
  expect(link('Songs')).toHaveClass('text-on-primary-container');
  expect(indicator('Songs')).toHaveClass(
    'bg-primary-container',
    'rounded-full',
    'scale-x-100',
    'opacity-100'
  );
  expect(indicator('Songs')).toHaveStyle({
    transition:
      'scale var(--md-sys-motion-duration-fast-spatial) var(--md-sys-motion-easing-fast-spatial), opacity var(--md-sys-motion-duration-fast-effects) var(--md-sys-motion-easing-fast-effects)',
  });

  // Dashboard is exact: /songs/12 doesn't select it.
  expect(link('Dashboard')).not.toHaveAttribute('aria-current');
  expect(link('Dashboard')).toHaveClass('text-on-surface-variant');
  expect(indicator('Dashboard')).toHaveClass('scale-x-0', 'opacity-0');
});

test('NavigationRailItem matches nested routes unless exact', () => {
  const item = (exact: boolean) => (
    <MemoryRouter initialEntries={['/songs/1']}>
      <NavigationRailItem to="/songs" text="Songs" icon={null} exact={exact} />
    </MemoryRouter>
  );
  const { rerender } = render(item(false));
  expect(screen.getByRole('link')).toHaveAttribute('aria-current', 'page');

  rerender(item(true));
  expect(screen.getByRole('link')).not.toHaveAttribute('aria-current');
});

test('following a link moves the indicator', () => {
  renderRail('/songs', []);
  fireEvent.click(link('Folders'));
  expect(link('Folders')).toHaveAttribute('aria-current', 'page');
  expect(indicator('Folders')).toHaveClass('scale-x-100');
  expect(indicator('Songs')).toHaveClass('scale-x-0');
});

test.each([
  ['350ms', 350],
  ['.35s', 350],
])('tapping the current destination pulses for %s', (token, expected) => {
  const animate = vi.fn<HTMLElement['animate']>();
  const indicator = document.createElement('span');
  indicator.animate = animate;
  indicator.style.setProperty('--md-sys-motion-duration-fast-spatial', token);
  document.body.append(indicator);

  pulse(indicator);

  expect(animate.mock.calls[0][1]).toMatchObject({ duration: expected });
  indicator.remove();
});
