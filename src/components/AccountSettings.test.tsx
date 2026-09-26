import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MessageProvider, type MessageContextValue } from 'stream-chat-react';
import type { StreamMessage } from 'stream-chat-react';
import FeedbackApi from '../api/FeedbackApi';
import FileApi from '../api/FileApi';
import PcoApi from '../api/PlanningCenterApi';
import settingsApi from '../api/settingsApi';
import useSubscription from '../hooks/api/useSubscription';
import { useUpdateCurrentUser } from '../hooks/api/currentUser.hooks';
import AccountAppearancePage from '../pages/AccountAppearancePage';
import AccountNotificationSettingsPage from '../pages/AccountNotificationSettingsPage';
import BillingPage from '../pages/BillingPage';
import FeedbackPopover from './FeedbackPopover';
import Integrations from './Integrations';
import NotificationSetting from './NotificationSetting';
import ProfilePictureDetail from './ProfilePictureDetail';
import TeamPlanOption from './TeamPlanOption';
import { MessageActions } from './chat/MessageActions';
import { MessageOptions } from './chat/MessageOptions';
import { isPoll } from '../utils/chat';
import { renderWithProvider } from '../utils/test';
import type { NotificationSetting as NotificationSettingModel } from '../types';

// Pins the behavior around the code CAD-137 typed: account settings, billing,
// integrations and chat.

vi.mock('../api/FeedbackApi');
vi.mock('../api/FileApi');
vi.mock('../api/PlanningCenterApi');
vi.mock('../api/settingsApi');
vi.mock('../hooks/api/useSubscription');
vi.mock('../hooks/api/useCreateCustomerProtalSession', () => ({
  default: () => ({ isLoading: false, run: vi.fn() }),
}));
vi.mock('../hooks/api/currentUser.hooks', () => ({
  useCurrentUser: () => ({
    data: { id: 1, email: 'a@b.c', format_preferences: { hide_chords: false } },
  }),
  useUpdateCurrentUser: vi.fn(),
}));
vi.mock('../utils/error');

afterEach(() => {
  vi.resetAllMocks();
});

function message(fields: Partial<StreamMessage>) {
  // `as`: a fixture with only the fields the code under test reads.
  return { id: 'm1', ...fields } as StreamMessage;
}

test('isPoll checks the first attachment', () => {
  expect(isPoll(message({ attachments: [{ type: 'poll' }] }))).toBe(true);
  expect(
    isPoll(message({ attachments: [{ type: 'image' }, { type: 'poll' }] }))
  ).toBe(false);
  expect(isPoll(message({ attachments: [] }))).toBe(false);
  expect(isPoll(message({}))).toBe(false);
});

test('MessageOptions offers reactions except on polls and hides for errors', () => {
  function renderOptions(fields: Partial<StreamMessage>) {
    // `as`: MessageOptions reads only these fields of the message context.
    const value = {
      getMessageActions: () => ['react'],
      message: message(fields),
      onReactionListClick: vi.fn(),
    } as unknown as MessageContextValue;
    return render(
      <MessageProvider value={value}>
        <MessageOptions />
      </MessageProvider>
    );
  }

  const { unmount } = renderOptions({ type: 'regular' });
  expect(screen.getByTestId('message-reaction-action')).toBeInTheDocument();
  expect(screen.queryByTestId('message-actions')).toBeNull();
  unmount();

  const poll = renderOptions({
    type: 'regular',
    attachments: [{ type: 'poll' }],
  });
  expect(screen.getByTestId('message-options')).toBeInTheDocument();
  expect(screen.queryByTestId('message-reaction-action')).toBeNull();
  poll.unmount();

  const { container } = renderOptions({ type: 'error' });
  expect(container).toBeEmptyDOMElement();
});

test.each([
  [true, false, ['Reply', 'Pin', 'Edit Message', 'Delete']],
  [true, true, ['Reply', 'Pin', 'Delete']],
  [false, false, ['Reply', 'Pin']],
])('MessageActions for mine=%s, poll=%s offers %j', (mine, poll, actions) => {
  // `as`: MessageActions reads only these fields of the message context.
  const value = {
    handleDelete: vi.fn(),
    handleFlag: vi.fn(),
    handleMute: vi.fn(),
    handlePin: vi.fn(),
    isMyMessage: () => mine,
    message: message(poll ? { attachments: [{ type: 'poll' }] } : {}),
    setEditingState: vi.fn(),
  } as unknown as MessageContextValue;
  render(
    <MessageProvider value={value}>
      <MessageActions />
    </MessageProvider>
  );

  const box = screen.getByTestId('message-actions-box');
  expect(box).not.toHaveClass('str-chat__message-actions-box--open');
  fireEvent.click(screen.getByTestId('message-actions'));
  expect(box).toHaveClass('str-chat__message-actions-box--open');
  // Escape closes it.
  fireEvent.keyUp(document, { key: 'Escape' });
  expect(box).not.toHaveClass('str-chat__message-actions-box--open');
  fireEvent.click(screen.getByTestId('message-actions'));
  expect(
    Array.from(box.querySelectorAll('button'), button => button.textContent)
  ).toEqual(actions);
});

test('NotificationSetting toggles each channel and saves it', () => {
  const onChange = vi.fn();
  const setting: NotificationSettingModel = {
    id: 7,
    notification_type: 'Event reminder',
    email_enabled: true,
    sms_enabled: false,
    push_enabled: false,
  };
  render(<NotificationSetting setting={setting} onChange={onChange} />);

  fireEvent.click(screen.getByText('Email'));
  expect(onChange).toHaveBeenLastCalledWith({
    ...setting,
    email_enabled: false,
  });
  expect(settingsApi.updateNotificationSetting).toHaveBeenLastCalledWith(7, {
    email_enabled: false,
  });

  fireEvent.click(screen.getByText('Text message'));
  expect(onChange).toHaveBeenLastCalledWith({ ...setting, sms_enabled: true });
  expect(settingsApi.updateNotificationSetting).toHaveBeenLastCalledWith(7, {
    sms_enabled: true,
  });

  fireEvent.click(screen.getByText('App (Push)'));
  expect(onChange).toHaveBeenLastCalledWith({ ...setting, push_enabled: true });
  expect(settingsApi.updateNotificationSetting).toHaveBeenLastCalledWith(7, {
    push_enabled: true,
  });
});

test('NotificationSetting renders without a setting', () => {
  const { container } = render(
    <NotificationSetting setting={undefined} onChange={vi.fn()} />
  );
  expect(container.textContent).toContain('Email');
});

test('AccountNotificationSettingsPage shows the event reminder setting and updates it', async () => {
  vi.mocked(settingsApi.getNotificationSettings).mockResolvedValue({
    data: [
      { id: 1, notification_type: 'Other', email_enabled: false },
      { id: 2, notification_type: 'Event reminder', email_enabled: false },
    ],
  } as Awaited<ReturnType<typeof settingsApi.getNotificationSettings>>);
  vi.mocked(settingsApi.updateNotificationSetting).mockResolvedValue(
    // `as`: the page ignores the response.
    {} as Awaited<ReturnType<typeof settingsApi.updateNotificationSetting>>
  );
  render(
    <MemoryRouter>
      <AccountNotificationSettingsPage />
    </MemoryRouter>
  );

  await screen.findByText('Event reminder');
  expect(screen.queryByText('Other')).toBeNull();

  fireEvent.click(screen.getByText('Email'));
  expect(settingsApi.updateNotificationSetting).toHaveBeenCalledWith(2, {
    email_enabled: true,
  });
  // The updated setting replaced the old one, so a second click turns it off.
  fireEvent.click(screen.getByText('Email'));
  expect(settingsApi.updateNotificationSetting).toHaveBeenLastCalledWith(2, {
    email_enabled: false,
  });
});

test('TeamPlanOption picks its plan by name', () => {
  const onClick = vi.fn();
  const { container, rerender } = render(
    <TeamPlanOption
      name="Pro"
      onClick={onClick}
      selected={false}
      className="mb-8"
      pricing="$20.00"
      trialMessage="7 Day Free Trial"
    />
  );
  const option = container.firstChild as HTMLElement;
  expect(option).toHaveClass('mb-8', 'border-gray-300');
  fireEvent.click(screen.getByText('Pro'));
  expect(onClick).toHaveBeenCalledWith('Pro');

  rerender(
    <TeamPlanOption
      name="Pro"
      onClick={onClick}
      selected
      className="mb-8"
      pricing="$20.00"
      trialMessage="7 Day Free Trial"
    />
  );
  expect(option).toHaveClass('border-blue-500');
});

test.each([
  [20, '$20.00'],
  [0, 'Free'],
  [undefined, 'Free'],
])('BillingPage with a price of %s shows %s', (price, text) => {
  vi.mocked(useSubscription).mockReturnValue({
    data: { plan_name: 'Pro', price, status: 'active' },
    isLoading: false,
    isError: false,
    isSuccess: true,
    isFetching: false,
    error: null,
  });
  renderWithProvider(<BillingPage />);
  expect(screen.getByText(text)).toBeInTheDocument();
  expect(screen.getByText('Pro Plan')).toBeInTheDocument();
});

test('BillingPage shows the trial end date while trialing', () => {
  vi.mocked(useSubscription).mockReturnValue({
    data: {
      plan_name: 'Pro',
      status: 'trialing',
      expires_at: '2026-03-05T12:00:00',
    },
    isLoading: false,
    isError: false,
    isSuccess: true,
    isFetching: false,
    error: null,
  });
  renderWithProvider(<BillingPage />);
  expect(screen.getByText('Trialing until Mar 5')).toBeInTheDocument();
});

test('AccountAppearancePage saves the hide chords preference', () => {
  const run = vi.fn();
  vi.mocked(useUpdateCurrentUser).mockReturnValue({
    run,
    isLoading: false,
    isError: false,
    error: null,
  });
  render(
    <MemoryRouter>
      <AccountAppearancePage />
    </MemoryRouter>
  );
  fireEvent.click(screen.getByRole('checkbox'));
  expect(run).toHaveBeenCalledWith({ prefers_hide_chords: true });
});

test('Integrations disconnects Planning Center', async () => {
  vi.mocked(PcoApi.disconnect).mockResolvedValue(
    // `as`: the component ignores the response.
    {} as Awaited<ReturnType<typeof PcoApi.disconnect>>
  );
  const currentUser = { id: 1, email: 'a@b.c', pco_connected: true };
  const { store } = renderWithProvider(
    <Integrations currentUser={currentUser} />,
    { preloadedState: { auth: { currentUser } } }
  );

  fireEvent.click(screen.getByText('Disconnect'));
  await waitFor(() =>
    expect(store.getState().auth.currentUser).toEqual({
      ...currentUser,
      pco_connected: false,
    })
  );
  expect(PcoApi.disconnect).toHaveBeenCalled();
});

describe('ProfilePictureDetail', () => {
  const currentUser = { id: 1, email: 'a@b.c', image_url: 'old.png' };

  beforeEach(() => {
    URL.createObjectURL = vi.fn(() => 'blob:temp');
    URL.revokeObjectURL = vi.fn();
  });

  function selectImage(container: HTMLElement, file: File) {
    // `as`: the component always renders its file input.
    const input = container.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } });
  }

  test('uploads the selected image, showing it meanwhile', async () => {
    let finishUpload = () => {};
    vi.mocked(FileApi.addImageToUser).mockReturnValue(
      new Promise(resolve => {
        // `as`: the component ignores the response.
        finishUpload = () =>
          resolve({} as Awaited<ReturnType<typeof FileApi.addImageToUser>>);
      })
    );
    const file = new File(['x'], 'me.png', { type: 'image/png' });
    const { container, store } = renderWithProvider(
      <ProfilePictureDetail url="old.png" />,
      { preloadedState: { auth: { currentUser } } }
    );

    selectImage(container, file);
    expect(store.getState().auth.currentUser?.image_url).toBe('blob:temp');
    expect(FileApi.addImageToUser).toHaveBeenCalledWith(file);

    finishUpload();
    await waitFor(() =>
      expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:temp')
    );
    expect(store.getState().auth.currentUser?.image_url).toBe('blob:temp');
  });

  test('clears the image when the upload fails', async () => {
    vi.mocked(FileApi.addImageToUser).mockRejectedValue(new Error('no'));
    const { container, store } = renderWithProvider(
      <ProfilePictureDetail url="old.png" />,
      { preloadedState: { auth: { currentUser } } }
    );

    selectImage(container, new File(['x'], 'me.png'));
    await waitFor(() =>
      expect(store.getState().auth.currentUser?.image_url).toBeNull()
    );
  });

  test('removes the image', async () => {
    vi.mocked(FileApi.deleteUserImage).mockResolvedValue(
      // `as`: the component ignores the response.
      {} as Awaited<ReturnType<typeof FileApi.deleteUserImage>>
    );
    const { store } = renderWithProvider(
      <ProfilePictureDetail url="old.png" />,
      { preloadedState: { auth: { currentUser } } }
    );

    fireEvent.click(screen.getByText('Remove'));
    await waitFor(() =>
      expect(store.getState().auth.currentUser).toEqual({
        ...currentUser,
        image_url: null,
      })
    );
  });
});

test('FeedbackPopover sends the feedback with the team and email', async () => {
  vi.mocked(FeedbackApi.create).mockResolvedValue(
    // `as`: the component ignores the response.
    {} as Awaited<ReturnType<typeof FeedbackApi.create>>
  );
  renderWithProvider(<FeedbackPopover />, {
    preloadedState: {
      auth: { teamId: '3', currentUser: { id: 1, email: 'a@b.c' } },
    },
  });

  fireEvent.click(screen.getByRole('button'));
  const submit = screen.getByText('Submit').closest('button');
  expect(submit).toBeDisabled();

  const textarea = screen.getByPlaceholderText('Submit feedback');
  fireEvent.change(textarea, { target: { value: 'Great app' } });
  expect(submit).toBeEnabled();
  fireEvent.click(screen.getByText('Submit'));

  expect(FeedbackApi.create).toHaveBeenCalledWith({
    team_id: '3',
    text: 'Great app',
    email: 'a@b.c',
    platform: 'web',
  });
  await waitFor(() => expect(textarea).toHaveValue(''));
});
