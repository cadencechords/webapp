import {
  act,
  cleanup,
  fireEvent,
  screen,
  waitFor,
} from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import type { ComponentProps } from 'react';
import type { AxiosResponse } from 'axios';
import InvitationApi from '../api/InvitationApi';
import MembershipsApi from '../api/membershipsApi';
import PermissionApi from '../api/permissionsApi';
import RolesApi from '../api/rolesApi';
import TeamApi from '../api/TeamApi';
import UserApi from '../api/UserApi';
import { renderWithProvider } from '../utils/test';
import {
  ADD_MEMBERS,
  ASSIGN_ROLES,
  EDIT_ROLES,
  REMOVE_MEMBERS,
} from '../utils/constants';
import JoinLinkSection from './JoinLinkSection';
import MemberCard from './MemberCard';
import PendingInvitationsList from './PendingInvitationsList';
import RolePermissions from './RolePermissions';
import SendInvitesDialog from './SendInvitesDialog';
import RoleDetailPage from '../pages/RoleDetailPage';
import AddMembersToRoleDialog from '../dialogs/AddMembersToRoleDialog';
import MembersIndexPage from '../pages/MembersIndexPage';
import type {
  CurrentTeamResponse,
  Invitation,
  Membership,
  Role,
  Team,
  User,
} from '../types';

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
    const onInviteSent =
      vi.fn<ComponentProps<typeof SendInvitesDialog>['onInviteSent']>();
    const onCloseDialog =
      vi.fn<ComponentProps<typeof SendInvitesDialog>['onCloseDialog']>();
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
    const onInvitationDeleted =
      vi.fn<
        ComponentProps<typeof PendingInvitationsList>['onInvitationDeleted']
      >();
    renderWithProvider(
      <PendingInvitationsList
        invitations={[invitation]}
        loading={false}
        onInvitationDeleted={onInvitationDeleted}
      />,
      { preloadedState: auth([ADD_MEMBERS]) }
    );

    // A two-line item in a segmented list: the email, then when it was sent.
    const item = screen.getByText('invited@example.com').closest('li')!;
    expect(item.parentElement).toHaveClass('list-segmented');
    expect(item).toHaveClass('min-h-[72px]');
    expect(screen.getByText('Sent Jul 2, 2022')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Resend' })).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Cancel the invitation to invited@example.com',
      })
    );

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

  test('resends an invitation', async () => {
    vi.mocked(InvitationApi.resendOne).mockResolvedValueOnce(response({}));
    renderWithProvider(
      <PendingInvitationsList
        invitations={[invitation]}
        loading={false}
        onInvitationDeleted={() => {}}
      />,
      { preloadedState: auth([ADD_MEMBERS]) }
    );
    fireEvent.click(screen.getByRole('button', { name: 'Resend' }));
    await waitFor(() =>
      expect(InvitationApi.resendOne).toHaveBeenCalledWith(5)
    );
  });

  test('says when there are no pending invitations', () => {
    renderWithProvider(
      <PendingInvitationsList
        invitations={[]}
        loading={false}
        onInvitationDeleted={() => {}}
      />,
      { preloadedState: auth([ADD_MEMBERS]) }
    );
    expect(screen.getByText('No pending invitations')).toBeInTheDocument();
    expect(document.querySelector('.list-segmented')).toBeNull();
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
    const toggle = screen.getByRole('switch', { name: 'Join link' });
    expect(toggle).toHaveAttribute('aria-checked', 'true');
    fireEvent.click(toggle);

    expect(store.getState().auth.currentTeam).toEqual({
      ...team,
      join_link_enabled: false,
    });
    await waitFor(() =>
      expect(TeamApi.update).toHaveBeenCalledWith({ join_link_enabled: false })
    );
  });
});

describe('JoinLinkSection card', () => {
  const team: Team = {
    id: 3,
    name: 'Worship team',
    join_link: 'abc',
    join_link_enabled: true,
  };

  test('is an M3E card that copies the link', () => {
    const writeText = vi.fn<(text: string) => Promise<void>>();
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });
    const { container } = renderWithProvider(<JoinLinkSection team={team} />, {
      preloadedState: auth([]),
    });
    expect(container.firstElementChild).toHaveClass(
      'rounded-extra-large',
      'bg-surface-container-low'
    );
    expect(
      screen.getByText('Anyone with this link can join Worship team.')
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Copy' }));
    expect(writeText).toHaveBeenCalledWith(
      expect.stringMatching(/\/join\/abc$/)
    );
    expect(screen.getByRole('button', { name: 'Copied' })).toBeDisabled();
  });

  test('dims the link and turns off Copy while the link is off', () => {
    renderWithProvider(
      <JoinLinkSection team={{ ...team, join_link_enabled: false }} />,
      { preloadedState: auth([]) }
    );
    expect(screen.getByRole('switch', { name: 'Join link' })).toHaveAttribute(
      'aria-checked',
      'false'
    );
    expect(screen.getByText(/\/join\/abc$/)).toHaveClass('text-on-surface/38');
    expect(screen.getByRole('button', { name: 'Copy' })).toBeDisabled();
  });
});

describe('MemberCard', () => {
  test("saves the current user's position a second after they stop typing", () => {
    vi.useFakeTimers();
    const onPositionChanged =
      vi.fn<ComponentProps<typeof MemberCard>['onPositionChanged']>();
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

describe('MemberCard profile card', () => {
  const teammate: User = {
    id: 2,
    email: 'sam@example.com',
    first_name: 'Sam',
    last_name: 'Lee',
    position: 'Drums',
  };

  function renderCard(
    props: Partial<ComponentProps<typeof MemberCard>>,
    permissions: string[] = []
  ) {
    const onShowMemberMenu = vi.fn<() => void>();
    const { container } = renderWithProvider(
      <MemoryRouter>
        <MemberCard
          member={teammate}
          isCurrentUser={false}
          onPositionChanged={() => {}}
          onShowMemberMenu={onShowMemberMenu}
          {...props}
        />
      </MemoryRouter>,
      { preloadedState: auth(permissions) }
    );
    return {
      card: container.firstElementChild as HTMLElement,
      onShowMemberMenu,
    };
  }

  test('shows the name and position on an M3E card', () => {
    const { card } = renderCard({});
    expect(card).toHaveClass('rounded-extra-large', 'bg-surface-container-low');
    expect(screen.getByText('Sam Lee')).toHaveClass('text-title-large');
    expect(screen.getByText('Drums')).toHaveClass('text-on-surface-variant');
    expect(screen.queryByText('Me')).not.toBeInTheDocument();
  });

  test('View profile is a link styled as a tonal button, not a nested button', () => {
    renderCard({});
    const link = screen.getByRole('link', { name: 'View profile' });
    expect(link).toHaveAttribute('href', '/members/2');
    expect(link).toHaveClass('bg-surface-container-highest', 'w-full');
    expect(link.querySelector('button')).toBeNull();
  });

  test('marks the current user and lets them edit their position', () => {
    renderCard({ member: { ...teammate, id: 1 }, isCurrentUser: true });
    expect(screen.getByText('Me')).toHaveClass('bg-tertiary-container');
    expect(screen.getByDisplayValue('Drums')).toBeInTheDocument();
  });

  test('offers the member menu only to members who can remove members', () => {
    renderCard({});
    expect(
      screen.queryByRole('button', { name: 'Options for Sam Lee' })
    ).not.toBeInTheDocument();

    cleanup();
    const { onShowMemberMenu } = renderCard({}, [REMOVE_MEMBERS]);
    fireEvent.click(
      screen.getByRole('button', { name: 'Options for Sam Lee' })
    );
    expect(onShowMemberMenu).toHaveBeenCalledTimes(1);
  });

  test('shows the email when there is no name, and no empty position', () => {
    renderCard({
      member: { id: 3, email: 'new@example.com', position: '' },
    });
    expect(screen.getByText('new@example.com')).toBeInTheDocument();
    expect(document.querySelector('.text-body-medium')).toBeNull();
  });
});

describe('MembersIndexPage', () => {
  const team: Team = { id: 3, name: 'Worship team', join_link: 'abc' };
  const members: User[] = [
    { id: 1, email: 'me@example.com', first_name: 'Me', last_name: 'Myself' },
    { id: 2, email: 'sam@example.com', first_name: 'Sam', last_name: 'Lee' },
  ];
  const invitation: Invitation = {
    id: 5,
    email: 'invited@example.com',
    created_at: '2022-07-02T12:00:00',
  };

  function renderPage(permissions: string[]) {
    vi.mocked(TeamApi.getCurrentTeam).mockResolvedValue(
      // `as`: a fixture. The page reads only the members.
      response({
        team,
        members,
      } as Partial<CurrentTeamResponse> as CurrentTeamResponse)
    );
    vi.mocked(InvitationApi.getAll).mockResolvedValue(response([invitation]));
    const state = auth(permissions);
    renderWithProvider(
      <MemoryRouter>
        <MembersIndexPage />
      </MemoryRouter>,
      { preloadedState: { auth: { ...state.auth, currentTeam: team } } }
    );
  }

  test('shows members and pending invites in tabs, with counts', async () => {
    renderPage([]);
    const membersTab = await screen.findByRole('tab', { name: 'Members (2)' });
    expect(membersTab).toHaveAttribute('aria-selected', 'true');
    expect(await screen.findByText('Sam Lee')).toBeInTheDocument();
    expect(screen.queryByText('invited@example.com')).not.toBeInTheDocument();

    const invitesTab = await screen.findByRole('tab', {
      name: 'Pending invites (1)',
    });
    fireEvent.click(invitesTab);
    expect(invitesTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('invited@example.com')).toBeInTheDocument();
    expect(screen.queryByText('Sam Lee')).not.toBeInTheDocument();
  });

  test('sends invites from an extended FAB, for members who can add members', async () => {
    renderPage([ADD_MEMBERS]);
    const fab = await screen.findByRole('button', { name: 'Send an invite' });
    expect(fab).toHaveClass('fixed', 'h-16', 'bg-tertiary-container');
    fireEvent.click(fab);
    expect(await screen.findByText('Invite a new member')).toBeInTheDocument();
  });

  test('offers no invite FAB without permission to add members', async () => {
    renderPage([]);
    await screen.findByText('Sam Lee');
    expect(
      screen.queryByRole('button', { name: 'Send an invite' })
    ).not.toBeInTheDocument();
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
    const onPermissionToggled =
      vi.fn<ComponentProps<typeof RolePermissions>['onPermissionToggled']>();
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
    const onPermissionToggled =
      vi.fn<ComponentProps<typeof RolePermissions>['onPermissionToggled']>();
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

  function renderPage(
    roleRequest: ReturnType<typeof RolesApi.getOne> = Promise.resolve(
      response(role)
    )
  ) {
    vi.mocked(RolesApi.getOne).mockReturnValue(roleRequest);
    vi.mocked(PermissionApi.getAll).mockResolvedValue(
      response([{ name: 'Add songs' }, { name: 'Edit songs' }])
    );
    vi.mocked(TeamApi.getMemberships).mockResolvedValue(response([]));
    return renderWithProvider(
      <MemoryRouter initialEntries={['/permissions/4']}>
        <Route path="/permissions/:id">
          <RoleDetailPage />
        </Route>
      </MemoryRouter>,
      { preloadedState: auth([EDIT_ROLES, ASSIGN_ROLES]) }
    );
  }

  // useRole's placeholder must be the same object each render, or useCopy
  // resets during render until React gives up ("Too many re-renders"). Both
  // tests re-render the page before the role arrives.
  test('keeps loading when the permissions arrive before the role', async () => {
    const { container } = renderPage(new Promise(() => {}));
    await waitFor(() => expect(PermissionApi.getAll).toHaveBeenCalled());
    // react-query passes the permissions on after a timeout.
    await act(() => new Promise(resolve => setTimeout(resolve, 20)));
    // PageLoading's spinner: a crash would have emptied the page.
    expect(container).not.toBeEmptyDOMElement();
    expect(screen.queryByText('Add songs')).not.toBeInTheDocument();
  });

  test('says so when the role fails to load', async () => {
    renderPage(Promise.reject(new Error('offline')));
    expect(
      await screen.findByText('There was an issue retrieving this role.')
    ).toBeInTheDocument();
  });

  test('checks a permission once it is added to the role', async () => {
    vi.mocked(RolesApi.addPermission).mockResolvedValue(response({}));
    renderPage();

    fireEvent.click(await screen.findByText('Add songs'));

    await waitFor(() =>
      expect(RolesApi.addPermission).toHaveBeenCalledWith(4, 'Add songs')
    );
    expect(screen.getByRole('switch', { name: /Add songs/ })).toBeChecked();
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

  test('lays the role out as M3E sections', async () => {
    renderPage();
    expect(
      await screen.findByRole('heading', { name: 'Members' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Add members' })
    ).toBeInTheDocument();
    const member = screen
      .getByText('member@example.com')
      .closest('.list-segmented > *')!;
    expect(member).toHaveClass('min-h-[72px]');
    expect(
      screen.getByRole('heading', { name: 'Song permissions' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Billing permissions' })
    ).toBeInTheDocument();
    // An editable role: switches on, and no built-in chip.
    expect(screen.getByRole('switch', { name: /Add songs/ })).toBeEnabled();
    expect(screen.queryByText(/Built-in role/)).not.toBeInTheDocument();
  });

  test('marks a built-in role, whose permissions can’t change', async () => {
    renderPage(Promise.resolve(response({ ...role, is_admin: true })));
    expect(await screen.findByText(/Built-in role/)).toBeInTheDocument();
    const addSongs = screen.getByRole('switch', { name: /Add songs/ });
    expect(addSongs).toBeDisabled();
    fireEvent.click(screen.getByText('Add songs'));
    expect(RolesApi.addPermission).not.toHaveBeenCalled();
    expect(
      screen.queryByRole('button', { name: 'Delete role' })
    ).not.toBeInTheDocument();
  });

  test('moves a member out of the role, back to Member', async () => {
    vi.mocked(MembershipsApi.assignRole).mockResolvedValue(
      response(membership)
    );
    renderPage();

    fireEvent.click(
      await screen.findByRole('button', {
        name: 'Remove member@example.com from this role',
      })
    );

    await waitFor(() =>
      expect(MembershipsApi.assignRole).toHaveBeenCalledWith(12, 'Member')
    );
  });
});

describe('AddMembersToRoleDialog', () => {
  const inRole: Membership = {
    id: 12,
    user: { id: 2, email: 'in@example.com' },
    role: { id: 4, name: 'Worship leader' },
  };
  const sam: Membership = {
    id: 13,
    user: {
      id: 3,
      email: 'sam@example.com',
      first_name: 'Sam',
      last_name: 'Lee',
    },
    role: { id: 2, name: 'Member' },
  };
  const ada: Membership = {
    id: 14,
    user: { id: 4, email: 'ada@example.com' },
    role: { id: 2, name: 'Member' },
  };

  function renderDialog(teamMembers: Membership[]) {
    vi.mocked(TeamApi.getMemberships).mockResolvedValue(response(teamMembers));
    vi.mocked(RolesApi.assignRoleBulk).mockResolvedValue(response([]));
    renderWithProvider(
      <MemoryRouter initialEntries={['/permissions/4']}>
        <Route path="/permissions/:id">
          <AddMembersToRoleDialog
            open
            membersInRole={[inRole]}
            onCloseDialog={() => {}}
          />
        </Route>
      </MemoryRouter>,
      { preloadedState: auth([ASSIGN_ROLES]) }
    );
  }

  test('lists the members not yet in the role and adds the checked ones', async () => {
    renderDialog([inRole, sam, ada]);
    const samRow = (await screen.findByText('Sam Lee')).closest('label')!;
    expect(samRow.parentElement).toHaveClass('list-segmented');
    // Rows on surface-container-high in dark mode, over a lower dialog.
    expect(samRow).toHaveClass('dark:bg-surface-container-high');
    expect(samRow.closest('.dark\\:bg-surface-container-low')).not.toBeNull();
    expect(samRow).toHaveTextContent('sam@example.com');
    expect(samRow).toHaveTextContent('Member');
    // Without a name: the email, then their current role.
    expect(screen.getByText('Currently Member')).toBeInTheDocument();
    expect(screen.queryByText('in@example.com')).not.toBeInTheDocument();

    const add = screen.getByRole('button', { name: 'Add' });
    expect(add).toBeDisabled();
    fireEvent.click(screen.getByText('Sam Lee'));
    fireEvent.click(screen.getByText('ada@example.com'));
    fireEvent.click(screen.getByRole('button', { name: 'Add 2 members' }));

    // Closing on success reads the role page's cached role, which this test
    // doesn't load, so it checks the request only.
    await waitFor(() =>
      expect(RolesApi.assignRoleBulk).toHaveBeenCalledWith([13, 14], '4')
    );
  });

  test('says when everyone is already in the role', async () => {
    renderDialog([inRole]);
    expect(
      await screen.findByText('Everyone on the team is already in this role')
    ).toBeInTheDocument();
  });
});
