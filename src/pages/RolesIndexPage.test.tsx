import { fireEvent, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProvider } from '../utils/test';
import RolesIndexPage from './RolesIndexPage';
import type { Membership, Role } from '../types';

const admin: Role = {
  id: 1,
  name: 'Admin',
  // `as`: a fixture. The page only counts a role's memberships.
  memberships: [{ id: 10 } as Membership],
};
const member: Role = { id: 2, name: 'Member', memberships: [] };
const members: Membership[] = [
  {
    id: 10,
    user: {
      id: 5,
      email: 'sam@example.com',
      first_name: 'Sam',
      last_name: 'Lee',
    },
    role: admin,
  },
  { id: 11, user: { id: 6, email: 'new@example.com' }, role: member },
];

vi.mock('../hooks/api/useRoles', () => ({
  default: () => ({ data: [admin, member], isLoading: false, isError: false }),
}));
vi.mock('../hooks/api/useTeamMembers', () => ({
  default: () => ({ data: members, isLoading: false, isError: false }),
}));
const assignRole = vi.hoisted(() =>
  vi.fn<(args: { memberId: number; roleName: string }) => void>()
);
vi.mock('../hooks/api/useAssignRoleToMember', () => ({
  default: () => ({ run: assignRole }),
}));
vi.mock('../dialogs/CreateRoleDialog', () => ({
  default: ({ open }: { open: boolean }) =>
    open ? <div>Create role dialog</div> : null,
}));

function renderPage(permissions: string[] = []) {
  renderWithProvider(
    <MemoryRouter>
      <RolesIndexPage />
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
        },
      },
    }
  );
}

test('lists the roles as rows that open each role', () => {
  renderPage();
  expect(screen.getByRole('heading', { name: 'Roles' })).toBeInTheDocument();
  const adminRow = screen.getByRole('link', { name: /Admin/ });
  expect(adminRow).toHaveAttribute('href', '/permissions/1');
  expect(adminRow).toHaveTextContent('1 member');
  expect(adminRow.parentElement).toHaveClass('list-segmented');
  expect(screen.getByRole('link', { name: /Member/ })).toHaveTextContent(
    '0 members'
  );
});

test('lists the members with their names, emails and roles', () => {
  renderPage();
  const sam = screen.getByText('Sam Lee').closest('.list-segmented > *')!;
  expect(sam).toHaveTextContent('sam@example.com');
  expect(sam).toHaveTextContent('Admin');
  // Without a name, the email is the headline.
  expect(screen.getByText('new@example.com')).toBeInTheDocument();
  // No dropdowns without permission to assign roles.
  expect(screen.queryByRole('button', { name: /Admin/ })).toBeNull();
});

test('offers a New role FAB and role dropdowns to admins', () => {
  renderPage(['Add roles', 'Assign roles']);
  const fab = screen.getByRole('button', { name: 'New role' });
  expect(fab).toHaveClass('fixed', 'bg-tertiary-container');
  fab.click();
  expect(screen.getByText('Create role dialog')).toBeInTheDocument();
  expect(screen.getAllByRole('button', { name: /Admin|Member/ })).toHaveLength(
    2
  );
});

test('offers no New role FAB without permission to add roles', () => {
  renderPage();
  expect(
    screen.queryByRole('button', { name: 'New role' })
  ).not.toBeInTheDocument();
});

test('assigns a role from the member’s role menu', () => {
  renderPage(['Assign roles']);
  const sam = screen.getByText('Sam Lee').closest('.list-segmented > *')!;
  const menuButton = within(sam as HTMLElement).getByRole('button', {
    name: /Admin/,
  });
  expect(menuButton).toHaveClass(
    'rounded-[20px]',
    'bg-surface-container-highest'
  );
  fireEvent.click(menuButton);

  const items = document.querySelectorAll('[data-menu-item]');
  expect([...items].map(item => item.textContent)).toEqual(['Admin', 'Member']);
  // The member's role is the selected one.
  expect(items[0]).toHaveClass('bg-tertiary-container');
  fireEvent.click(items[1]);
  expect(assignRole).toHaveBeenCalledWith({ memberId: 10, roleName: 'Member' });
});
