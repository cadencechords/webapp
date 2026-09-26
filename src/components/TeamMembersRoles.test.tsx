import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import type { AxiosResponse } from 'axios';
import InvitationApi from '../api/InvitationApi';
import MembershipsApi from '../api/membershipsApi';
import PermissionApi from '../api/permissionsApi';
import RolesApi from '../api/rolesApi';
import TeamApi from '../api/TeamApi';
import UserApi from '../api/UserApi';
import { renderWithProvider } from '../utils/test';
import { ADD_MEMBERS, ASSIGN_ROLES, EDIT_ROLES } from '../utils/constants';
import JoinLinkSection from './JoinLinkSection';
import MemberCard from './MemberCard';
import PendingInvitationsList from './PendingInvitationsList';
import RolePermissions from './RolePermissions';
import SendInvitesDialog from './SendInvitesDialog';
import RoleDetailPage from '../pages/RoleDetailPage';
import type { Invitation, Membership, Role, Team, User } from '../types';

vi.mock('../api/InvitationApi');
vi.mock('../api/membershipsApi');
vi.mock('../api/permissionsApi');
vi.mock('../api/rolesApi');
vi.mock('../api/TeamApi');
vi.mock('../api/UserApi');
vi.mock('../utils/error');

/** The signed-in user, whose role has `permissions`. */
function auth(permissions: string[]) {
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
    },
  };
}

function response<T>(data: T) {
  // `as`: a fixture. The components under test read only `data`.
  return { data } as AxiosResponse<T>;
}

// Each test sees only its own API calls. headlessui's Dialog can use
// ResizeObserver, which jsdom doesn't have.
beforeEach(() => {
  vi.clearAllMocks();
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
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('SendInvitesDialog', () => {
  const members: User[] = [{ id: 2, email: 'member@example.com' }];

  test('sends the invite and passes the new invitation on', async () => {
    const invitation: Invitation = {
      id: 9,
      email: 'new@example.com',
      created_at: '2022-07-02',
    };
    vi.mocked(InvitationApi.createOne).mockResolvedValueOnce(
      response(invitation)
    );
    const onInviteSent = vi.fn();
    const onCloseDialog = vi.fn();
    renderWithProvider(
      <SendInvitesDialog
        open
        onCloseDialog={onCloseDialog}
        currentMembers={members}
        onInviteSent={onInviteSent}
      />
    );

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'new@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Send invite' }));

    await waitFor(() => expect(onInviteSent).toHaveBeenCalledWith(invitation));
    expect(InvitationApi.createOne).toHaveBeenCalledWith({
      email: 'new@example.com',
    });
    expect(onCloseDialog).toHaveBeenCalled();
  });

  test("can't invite someone who's already a member", () => {
    renderWithProvider(
      <SendInvitesDialog
        open
        onCloseDialog={() => {}}
        currentMembers={members}
        onInviteSent={() => {}}
      />
    );

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'member@example.com' },
    });

    expect(screen.getByRole('button', { name: 'Send invite' })).toBeDisabled();
  });
});

describe('PendingInvitationsList', () => {
  const invitation: Invitation = {
    id: 5,
    email: 'invited@example.com',
    created_at: '2022-07-02T12:00:00',
  };

  test('lists when each invitation was sent, and deletes one', async () => {
    vi.mocked(InvitationApi.deleteOne).mockResolvedValueOnce(response({}));
    const onInvitationDeleted = vi.fn();
    renderWithProvider(
      <PendingInvitationsList
        invitations={[invitation]}
        loading={false}
        onInvitationDeleted={onInvitationDeleted}
      />,
      { preloadedState: auth([ADD_MEMBERS]) }
    );

    expect(screen.getByText('Sat Jul 02 2022')).toBeInTheDocument();
    const [resend, remove] = screen.getAllByRole('button');
    expect(resend).toHaveTextContent('Resend');
    fireEvent.click(remove);

    await waitFor(() => expect(onInvitationDeleted).toHaveBeenCalledWith(5));
    expect(InvitationApi.deleteOne).toHaveBeenCalledWith(5);
  });

  test('offers no actions without the Add members permission', () => {
    renderWithProvider(
      <PendingInvitationsList
        invitations={[invitation]}
        loading={false}
        onInvitationDeleted={() => {}}
      />,
      { preloadedState: auth([]) }
    );

    expect(screen.queryByRole('button')).toBeNull();
  });
});

describe('JoinLinkSection', () => {
  test('disables the join link in the store and through the API', async () => {
    const team: Team = {
      id: 3,
      name: 'Team',
      join_link: 'abc',
      join_link_enabled: true,
    };
    vi.mocked(TeamApi.update).mockResolvedValueOnce(response(team));
    const { store } = renderWithProvider(<JoinLinkSection team={team} />, {
      preloadedState: auth([]),
    });

    expect(screen.getByText(/\/join\/abc$/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Disable' }));

    expect(store.getState().auth.currentTeam).toEqual({
      ...team,
      join_link_enabled: false,
    });
    await waitFor(() =>
      expect(TeamApi.update).toHaveBeenCalledWith({ join_link_enabled: false })
    );
  });
});

describe('MemberCard', () => {
  test("saves the current user's position a second after they stop typing", () => {
    vi.useFakeTimers();
    const onPositionChanged = vi.fn();
    renderWithProvider(
      <MemoryRouter>
        <MemberCard
          member={{ id: 1, email: 'me@example.com', position: '' }}
          isCurrentUser
          onPositionChanged={onPositionChanged}
          onShowMemberMenu={() => {}}
        />
      </MemoryRouter>,
      { preloadedState: auth([]) }
    );

    const input = screen.getByPlaceholderText(
      "What's your position on the team?"
    );
    fireEvent.change(input, { target: { value: 'Keys' } });
    fireEvent.change(input, { target: { value: 'Keys and vocals' } });

    expect(onPositionChanged).toHaveBeenLastCalledWith('Keys and vocals');
    act(() => {
      vi.advanceTimersByTime(999);
    });
    expect(UserApi.updateMembership).not.toHaveBeenCalled();
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(UserApi.updateMembership).toHaveBeenCalledTimes(1);
    expect(UserApi.updateMembership).toHaveBeenCalledWith(1, {
      position: 'Keys and vocals',
    });
  });
});

describe('RolePermissions', () => {
  const role: Role = {
    id: 4,
    name: 'Worship leader',
    permissions: [{ name: 'Edit songs' }],
  };

  test('toggles a permission on and off for the role', async () => {
    vi.mocked(RolesApi.addPermission).mockResolvedValue(response({}));
    vi.mocked(RolesApi.removePermission).mockResolvedValue(response({}));
    const onPermissionToggled = vi.fn();
    renderWithProvider(
      <RolePermissions role={role} onPermissionToggled={onPermissionToggled} />,
      { preloadedState: auth([EDIT_ROLES]) }
    );

    fireEvent.click(screen.getByText('Add songs'));
    fireEvent.click(screen.getByText('Edit songs'));

    expect(onPermissionToggled).toHaveBeenNthCalledWith(1, 'Add songs', true);
    expect(onPermissionToggled).toHaveBeenNthCalledWith(2, 'Edit songs', false);
    await waitFor(() =>
      expect(RolesApi.addPermission).toHaveBeenCalledWith(4, 'Add songs')
    );
    await waitFor(() =>
      expect(RolesApi.removePermission).toHaveBeenCalledWith(4, 'Edit songs')
    );
  });

  test("the admin role's permissions can't be changed", () => {
    const onPermissionToggled = vi.fn();
    renderWithProvider(
      <RolePermissions
        role={{ ...role, is_admin: true }}
        onPermissionToggled={onPermissionToggled}
      />,
      { preloadedState: auth([EDIT_ROLES]) }
    );

    fireEvent.click(screen.getByText('Add songs'));

    expect(onPermissionToggled).not.toHaveBeenCalled();
  });
});

describe('RoleDetailPage', () => {
  const membership: Membership = {
    id: 12,
    user: { id: 2, email: 'member@example.com' },
    role: { id: 4, name: 'Worship leader' },
  };
  const role: Role = {
    id: 4,
    name: 'Worship leader',
    permissions: [],
    memberships: [membership],
  };

  function renderPage() {
    vi.mocked(RolesApi.getOne).mockResolvedValue(response(role));
    vi.mocked(PermissionApi.getAll).mockResolvedValue(
      response([{ name: 'Add songs' }, { name: 'Edit songs' }])
    );
    vi.mocked(TeamApi.getMemberships).mockResolvedValue(response([]));
    renderWithProvider(
      <MemoryRouter initialEntries={['/permissions/4']}>
        <Route path="/permissions/:id">
          <RoleDetailPage />
        </Route>
      </MemoryRouter>,
      { preloadedState: auth([EDIT_ROLES, ASSIGN_ROLES]) }
    );
  }

  test('checks a permission once it is added to the role', async () => {
    vi.mocked(RolesApi.addPermission).mockResolvedValue(response({}));
    renderPage();

    fireEvent.click(await screen.findByText('Add songs'));

    await waitFor(() =>
      expect(RolesApi.addPermission).toHaveBeenCalledWith(4, 'Add songs')
    );
    const permission = screen.getByText('Add songs').closest('.flex');
    expect(permission?.querySelector('input')).toBeChecked();
  });

  test('saves a new name a second after the last change', async () => {
    renderPage();
    const title = await screen.findByDisplayValue('Worship leader');

    vi.useFakeTimers();
    fireEvent.change(title, { target: { value: 'Band' } });

    expect(screen.getByDisplayValue('Band')).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(999);
    });
    expect(RolesApi.updateOne).not.toHaveBeenCalled();
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(RolesApi.updateOne).toHaveBeenCalledWith({ name: 'Band' }, '4');
  });

  test('moves a member out of the role, back to Member', async () => {
    vi.mocked(MembershipsApi.assignRole).mockResolvedValue(
      response(membership)
    );
    renderPage();

    const row = (await screen.findByText('member@example.com')).parentElement;
    const remove = row?.querySelector('button');
    expect(remove).toBeInstanceOf(HTMLButtonElement);
    // `as`: the assertion above checked it.
    fireEvent.click(remove as HTMLButtonElement);

    await waitFor(() =>
      expect(MembershipsApi.assignRole).toHaveBeenCalledWith(12, 'Member')
    );
  });
});
