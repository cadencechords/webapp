import { fireEvent, screen, waitFor } from '@testing-library/react';
import type { AxiosResponse } from 'axios';
import type { ComponentProps } from 'react';
import SessionsApi from '../api/sessionsApi';
import { renderWithProvider } from '../utils/test';
import SessionCard from './SessionCard';
import SetlistSessionsList from './SetlistSessionsList';
import type { Session, User } from '../types';

vi.mock('../api/sessionsApi');
vi.mock('../utils/error');

const me: User = { id: 1, email: 'me@example.com' };
const host: User = {
  id: 7,
  email: 'sam@example.com',
  first_name: 'Sam',
  last_name: 'Lee',
};
const theirs: Session = { id: 3, setlist_id: 9, user_id: 7, user: host };
const mine: Session = { id: 4, setlist_id: 9, user_id: 1, user: me };

function response<T>(data: T) {
  // `as`: a fixture. The components under test read only `data`.
  return { data } as AxiosResponse<T>;
}

const signedIn = { preloadedState: { auth: { currentUser: me } } };

beforeEach(() => {
  vi.clearAllMocks();
});

describe('SetlistSessionsList', () => {
  function renderList(
    sessions: Session[],
    extraProps: Partial<ComponentProps<typeof SetlistSessionsList>> = {}
  ) {
    vi.mocked(SessionsApi.getActiveSessions).mockResolvedValue(
      response(sessions)
    );
    const props: ComponentProps<typeof SetlistSessionsList> = {
      setlist: { id: 9, name: 'Sunday' },
      sessions,
      onSessionsChange: vi.fn<(sessions: Session[]) => void>(),
      onJoinSession: vi.fn<(session: Session) => void>(),
      ...extraProps,
    };
    renderWithProvider(<SetlistSessionsList {...props} />, signedIn);
    return props;
  }

  test('lists the sessions as two-line items in a segmented list', async () => {
    const { onJoinSession } = renderList([theirs, mine]);
    await waitFor(() =>
      expect(SessionsApi.getActiveSessions).toHaveBeenCalledWith(9)
    );
    expect(
      screen.getByRole('heading', { name: 'Sessions' })
    ).toBeInTheDocument();

    const item = screen.getByText('Sam Lee').closest('.list-segmented > *')!;
    expect(item.parentElement).toHaveClass('list-segmented');
    expect(item).toHaveClass('min-h-[72px]');
    expect(screen.getByText('Host')).toBeInTheDocument();
    expect(screen.getByText('Host · You')).toBeInTheDocument();

    const join = screen.getByRole('button', { name: 'Join session' });
    expect(join).toHaveClass('bg-primary', 'h-10');
    fireEvent.click(join);
    expect(onJoinSession).toHaveBeenCalledWith(theirs);
  });

  test('lets the host end their session', async () => {
    vi.mocked(SessionsApi.endSession).mockResolvedValue(response(mine));
    const { onSessionsChange } = renderList([theirs, mine]);
    const end = screen.getByRole('button', { name: 'End session' });
    expect(end).toHaveClass('bg-error-container', 'h-10');
    fireEvent.click(end);
    await waitFor(() =>
      expect(onSessionsChange).toHaveBeenLastCalledWith([theirs])
    );
    expect(SessionsApi.endSession).toHaveBeenCalledWith(9, 4);
  });

  test('tapping a row opens the set in the presenter, and its button still does its own thing', () => {
    const onOpenInPresenter = vi.fn<() => void>();
    const { onJoinSession } = renderList([theirs, mine], { onOpenInPresenter });

    const rows = screen.getAllByRole('button', { name: 'Perform set' });
    expect(rows).toHaveLength(2);
    fireEvent.click(rows[0]!);
    expect(onOpenInPresenter).toHaveBeenCalledTimes(1);
    expect(onJoinSession).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Join session' }));
    expect(onJoinSession).toHaveBeenCalledWith(theirs);
    expect(onOpenInPresenter).toHaveBeenCalledTimes(1);
  });

  test('rows aren’t tappable without onOpenInPresenter', () => {
    renderList([theirs]);
    expect(
      screen.queryByRole('button', { name: 'Perform set' })
    ).not.toBeInTheDocument();
  });

  test('says when there are no active sessions', async () => {
    renderList([]);
    expect(
      await screen.findByText('No active sessions to show')
    ).toBeInTheDocument();
    expect(document.querySelector('.list-segmented')).toBeNull();
  });
});

test('SessionCard offers Leave for the session you’ve joined', () => {
  const onLeave = vi.fn<(session: Session) => void>();
  renderWithProvider(
    <SessionCard
      session={theirs}
      isActive
      onJoin={() => {}}
      onLeave={onLeave}
    />,
    signedIn
  );
  fireEvent.click(screen.getByRole('button', { name: 'Leave session' }));
  expect(onLeave).toHaveBeenCalledWith(theirs);
});

test('SessionCard shows your own picture when you host', () => {
  const { container } = renderWithProvider(
    <SessionCard session={mine} onJoin={() => {}} />,
    {
      preloadedState: {
        auth: {
          currentUser: { ...me, image_url: 'https://example.com/me.png' },
        },
      },
    }
  );
  expect(container.querySelector('[style*="me.png"]')).not.toBeNull();
});
