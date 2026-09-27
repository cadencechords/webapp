import { act, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { renderWithProvider } from '../utils/test';
import { reportError } from '../utils/error';
import ChatPage from './ChatPage';

const stream = vi.hoisted(() => ({
  connectUser: vi.fn<(user: { id: string }, token: string) => Promise<void>>(),
  channel: vi.fn<(type: string, id: string) => { cid: string }>((type, id) => ({
    cid: `${type}:${id}`,
  })),
}));

vi.mock('stream-chat', () => ({
  StreamChat: class {
    connectUser = stream.connectUser;
    channel = stream.channel;
  },
}));
// Stand-ins that show which channel the page opened.
vi.mock('stream-chat-react', () => ({
  Chat: ({ children }: { children?: ReactNode }) => <>{children}</>,
  Channel: ({
    channel,
    children,
  }: {
    channel: { cid: string };
    children?: ReactNode;
  }) => <section aria-label={channel.cid}>{children}</section>,
  Window: ({ children }: { children?: ReactNode }) => <>{children}</>,
  MessageList: () => null,
  MessageInput: () => null,
}));
vi.mock('../utils/error', () => ({ reportError: vi.fn<typeof reportError>() }));
// Both read window.matchMedia, which jsdom doesn't have.
vi.mock('../hooks/useBreakPoints', () => ({
  default: () => ({ isMd: true }),
}));
vi.mock('../hooks/useTheme', () => ({ default: () => ({ isDark: false }) }));

const signedIn = {
  auth: {
    currentUser: { id: 3, chat_token: 'token' },
    currentTeam: { id: 8 },
  },
};

function renderPage() {
  return renderWithProvider(<ChatPage />, { preloadedState: signedIn });
}

afterEach(() => {
  vi.clearAllMocks();
});

test('ChatPage opens the team channel once the user is connected', async () => {
  let connected!: () => void;
  stream.connectUser.mockReturnValue(
    new Promise(resolve => {
      connected = resolve;
    })
  );
  renderPage();
  expect(stream.connectUser).toHaveBeenCalledWith({ id: '3' }, 'token');
  expect(screen.queryByRole('region')).not.toBeInTheDocument();

  await act(async () => connected());
  expect(stream.channel).toHaveBeenCalledWith('messaging', '8');
  expect(
    screen.getByRole('region', { name: 'messaging:8' })
  ).toBeInTheDocument();
});

test('ChatPage opens no channel if it closes before connecting', async () => {
  let connected!: () => void;
  stream.connectUser.mockReturnValue(
    new Promise(resolve => {
      connected = resolve;
    })
  );
  const { unmount } = renderPage();
  unmount();
  await act(async () => connected());
  expect(stream.channel).not.toHaveBeenCalled();
});

test('ChatPage reports a failed connection', async () => {
  const error = new Error('offline');
  stream.connectUser.mockRejectedValue(error);
  renderPage();
  await act(async () => {});
  expect(reportError).toHaveBeenCalledWith(error);
  expect(screen.queryByRole('region')).not.toBeInTheDocument();
});
