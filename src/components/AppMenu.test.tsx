import { fireEvent, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProvider } from '../utils/test';
import { MANAGE_BILLING, VIEW_EVENTS, VIEW_ROLES } from '../utils/constants';
import AppMenu from './mobile menus/AppMenu';

// headlessui's Dialog can use ResizeObserver, which jsdom doesn't have.
beforeEach(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  );
});
afterEach(() => {
  vi.unstubAllGlobals();
});

function renderMenu(permissions: string[], isPro = true) {
  const onCloseDialog = vi.fn<() => void>();
  renderWithProvider(
    <MemoryRouter>
      <AppMenu open onCloseDialog={onCloseDialog} />
    </MemoryRouter>,
    {
      preloadedState: {
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
      },
    }
  );
  return onCloseDialog;
}

const links = () => screen.getAllByRole('link').map(link => link.textContent);

test('the menu lists every destination in three sections', () => {
  renderMenu([VIEW_EVENTS, VIEW_ROLES, MANAGE_BILLING]);
  expect(links()).toEqual([
    'Dashboard',
    'Folders',
    'Songs',
    'Sets',
    'Team members',
    'Calendar',
    'Permissions',
    'Billing',
    'Switch teams',
  ]);
  expect(document.querySelectorAll('.list-segmented')).toHaveLength(3);
});

test('the menu hides what the member or plan can’t use, and any empty section', () => {
  renderMenu([], false);
  expect(links()).toEqual([
    'Dashboard',
    'Folders',
    'Songs',
    'Sets',
    'Team members',
    'Switch teams',
  ]);
  expect(document.querySelectorAll('.list-segmented')).toHaveLength(2);
});

test('choosing a destination closes the menu', () => {
  const onCloseDialog = renderMenu([]);
  fireEvent.click(screen.getByRole('link', { name: 'Songs' }));
  expect(onCloseDialog).toHaveBeenCalled();
});
