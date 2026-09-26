import { act, render, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import type { AxiosResponse } from 'axios';
import BinderApi from '../../api/BinderApi';
import RolesApi from '../../api/rolesApi';
import MembershipsApi from '../../api/membershipsApi';
import PlanningCenterApi from '../../api/PlanningCenterApi';
import EventsApi from '../../api/eventsApi';
import useAddSongsToBinder from './useAddSongsToBinder';
import useRemoveSongFromBinder from './useRemoveSongFromBinder';
import useAddMembersToRole from './useAddMembersToRole';
import useRemoveMemberFromRole from './useRemoveMemberFromRole';
import useAssignRoleToMember from './useAssignRoleToMember';
import useDeleteBinder from './useDeleteBinder';
import useSetlist from './useSetlist';
import useCalendarEvent from './useCalendarEvent';
import usePlanningCenterSongs from './usePlanningCenterSongs';
import useBinder from './useBinder';
import useRole from './useRole';
import { toMonthYearDate } from '../../utils/DateUtils';
import type {
  Binder,
  CalendarEvent,
  Membership,
  Role,
  Song,
  User,
} from '../../types';

vi.mock('../../api/BinderApi', () => ({
  default: {
    addSongs: vi.fn(),
    removeSongs: vi.fn(),
    deleteOneById: vi.fn(),
    getOneById: vi.fn(),
  },
}));
vi.mock('../../api/rolesApi', () => ({
  default: { assignRoleBulk: vi.fn(), getOne: vi.fn() },
}));
vi.mock('../../api/membershipsApi', () => ({
  default: { assignRole: vi.fn() },
}));
vi.mock('../../api/PlanningCenterApi', () => ({
  default: { getSongs: vi.fn() },
}));
vi.mock('../../api/eventsApi', () => ({ default: { get: vi.fn() } }));
vi.mock('../../api/SetlistApi', () => ({ default: { getOne: vi.fn() } }));
vi.mock('../../utils/error', () => ({ reportError: vi.fn() }));

/**
 * A response with just `data`. A cast, because the hooks read nothing else
 * of an `AxiosResponse`.
 */
const response = <T,>(data: T) => ({ data }) as AxiosResponse<T>;

/** A promise that never settles, for requests still in flight. */
const pending = () => new Promise<never>(() => {});

const song = (id: number): Song => ({ id, name: `Song ${id}`, format: {} });
const user = (id: number): User => ({ id, email: `${id}@example.com` });
const membership = (id: number, role: Role): Membership => ({
  id,
  user: user(id),
  role,
});

let queryClient: QueryClient;

beforeEach(() => {
  vi.clearAllMocks();
  queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
});

/** Renders `hook` inside a QueryClientProvider and returns its latest value. */
function renderHookValue<T>(hook: () => T) {
  const result: { current: T | undefined } = { current: undefined };
  function Probe() {
    result.current = hook();
    return null;
  }
  function Wrapper({ children }: { children?: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }
  render(
    <Wrapper>
      <Probe />
    </Wrapper>
  );
  return result as { current: T };
}

describe('optimistic cache updates', () => {
  test('useAddSongsToBinder appends the added songs to the cached binder', async () => {
    const binder: Binder = { id: 7, name: 'Hymns', songs: [song(1)] };
    queryClient.setQueryData(['binders', '7'], binder);
    vi.mocked(BinderApi.addSongs).mockResolvedValue(response([song(2)]));
    const onSuccess = vi.fn();

    const hook = renderHookValue(() => useAddSongsToBinder({ onSuccess }));
    act(() => hook.current.run({ binderId: 7, songIds: [2] }));

    await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1));
    expect(BinderApi.addSongs).toHaveBeenCalledWith(7, [2]);
    expect(queryClient.getQueryData(['binders', '7'])).toEqual({
      id: 7,
      name: 'Hymns',
      songs: [song(1), song(2)],
    });
    expect(queryClient.getQueryState(['binders', '7'])?.isInvalidated).toBe(
      true
    );
  });

  test('useRemoveSongFromBinder removes the song from the cached binder', async () => {
    queryClient.setQueryData<Binder>(['binders', '7'], {
      id: 7,
      name: 'Hymns',
      songs: [song(1), song(2)],
    });
    vi.mocked(BinderApi.removeSongs).mockResolvedValue(response(undefined));
    const onSuccess = vi.fn();

    const hook = renderHookValue(() => useRemoveSongFromBinder({ onSuccess }));
    act(() => hook.current.run({ binderId: 7, songId: 1 }));

    await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1));
    expect(BinderApi.removeSongs).toHaveBeenCalledWith(7, [1]);
    expect(queryClient.getQueryData<Binder>(['binders', '7'])?.songs).toEqual([
      song(2),
    ]);
  });

  test('useAddMembersToRole appends the new memberships to the cached role', async () => {
    const role: Role = { id: 3, name: 'Editor', memberships: [] };
    role.memberships = [membership(1, role)];
    queryClient.setQueryData(['roles', '3'], role);
    const added = [membership(2, role)];
    vi.mocked(RolesApi.assignRoleBulk).mockResolvedValue(response(added));
    const onSuccess = vi.fn();

    const hook = renderHookValue(() => useAddMembersToRole({ onSuccess }));
    act(() => hook.current.run({ memberIds: [2], roleId: 3 }));

    await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1));
    expect(
      queryClient
        .getQueryData<Role>(['roles', '3'])
        ?.memberships?.map(m => m.id)
    ).toEqual([1, 2]);
  });

  test('useRemoveMemberFromRole removes the member before the request finishes', async () => {
    const role: Role = { id: 3, name: 'Editor' };
    role.memberships = [membership(1, role), membership(2, role)];
    queryClient.setQueryData(['roles', '3'], role);
    vi.mocked(MembershipsApi.assignRole).mockReturnValue(pending());

    const hook = renderHookValue(() => useRemoveMemberFromRole());
    act(() => hook.current.run({ memberId: 1, roleId: 3 }));

    await waitFor(() =>
      expect(
        queryClient
          .getQueryData<Role>(['roles', '3'])
          ?.memberships?.map(m => m.id)
      ).toEqual([2])
    );
    expect(MembershipsApi.assignRole).toHaveBeenCalledWith(1, 'Member');
  });

  test('useAssignRoleToMember gives the cached member the named role', async () => {
    const editor: Role = { id: 3, name: 'Editor' };
    const member: Role = { id: 4, name: 'Member' };
    queryClient.setQueryData(['roles'], [editor, member]);
    queryClient.setQueryData(['members'], [membership(1, member)]);
    vi.mocked(MembershipsApi.assignRole).mockReturnValue(pending());

    const hook = renderHookValue(() => useAssignRoleToMember());
    act(() => hook.current.run({ memberId: 1, roleName: 'Editor' }));

    await waitFor(() =>
      expect(
        queryClient.getQueryData<Membership[]>(['members'])?.[0].role
      ).toEqual(editor)
    );
  });
});

test('useDeleteBinder succeeds without waiting for the delete', async () => {
  vi.mocked(BinderApi.deleteOneById).mockReturnValue(pending());
  const onSuccess = vi.fn();

  const hook = renderHookValue(() => useDeleteBinder({ onSuccess }));
  act(() => hook.current.run(7));

  await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1));
  expect(BinderApi.deleteOneById).toHaveBeenCalledWith(7);
});

describe('data before the query loads', () => {
  test('useSetlist and useCalendarEvent default to []', () => {
    const setlist = renderHookValue(() => useSetlist(5, { enabled: false }));
    const event = renderHookValue(() =>
      useCalendarEvent(5, { enabled: false })
    );
    expect(setlist.current.data).toEqual([]);
    expect(event.current.data).toEqual([]);
    expect(event.current.isLoading).toBe(false);
  });

  test('usePlanningCenterSongs defaults to [], which has no pages', () => {
    vi.mocked(PlanningCenterApi.getSongs).mockReturnValue(pending());
    const songs = renderHookValue(() => usePlanningCenterSongs('amazing'));
    expect(songs.current.data).toEqual([]);
    expect(songs.current.data.pages).toBeUndefined();
    expect(PlanningCenterApi.getSongs).toHaveBeenCalledWith(0, 'amazing');
  });

  test('useBinder and useRole default to {}', () => {
    vi.mocked(BinderApi.getOneById).mockReturnValue(pending());
    vi.mocked(RolesApi.getOne).mockReturnValue(pending());
    const binder = renderHookValue(() => useBinder(7));
    const role = renderHookValue(() => useRole(3));
    expect(binder.current.data).toEqual({});
    expect(role.current.data).toEqual({});
  });
});

test('useCalendarEvent passes onSuccess the loaded event', async () => {
  const event: CalendarEvent = { id: 5, title: 'Rehearsal' };
  vi.mocked(EventsApi.get).mockResolvedValue(response(event));
  const onSuccess = vi.fn();

  renderHookValue(() => useCalendarEvent(5, { onSuccess }));

  await waitFor(() => expect(onSuccess).toHaveBeenCalledWith(event));
});

test('toMonthYearDate accepts a String object', () => {
  expect(toMonthYearDate(Object('2024-03-15'))).toBe('Mar 2024');
  expect(toMonthYearDate('2024-03-15')).toBe('Mar 2024');
});
