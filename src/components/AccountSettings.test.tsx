import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { ComponentProps } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MessageProvider, type MessageContextValue } from 'stream-chat-react';
import type { StreamMessage } from 'stream-chat-react';
import FeedbackApi from '../api/FeedbackApi';
import FileApi from '../api/FileApi';
import PcoApi from '../api/PlanningCenterApi';
import settingsApi from '../api/settingsApi';
import UserApi from '../api/UserApi';
import useSubscription from '../hooks/api/useSubscription';
import type useCreateCustomerPortalSession from '../hooks/api/useCreateCustomerProtalSession';
import { useUpdateCurrentUser } from '../hooks/api/currentUser.hooks';
import AccountAppearancePage from '../pages/AccountAppearancePage';
import ThemeProvider from '../contexts/ThemeProvider';
import AccountGeneralSettingsPage from '../pages/AccountGeneralSettingsPage';
import AccountProfilePage from '../pages/AccountProfilePage';
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
vi.mock('../api/UserApi');
vi.mock('../hooks/api/useSubscription');
vi.mock('../hooks/api/useCreateCustomerProtalSession', () => ({
  default: () => ({
    isLoading: false,
    run: vi.fn<ReturnType<typeof useCreateCustomerPortalSession>['run']>(),
  }),
}));
vi.mock('../hooks/api/currentUser.hooks', () => ({
  useCurrentUser: () => ({
    data: { id: 1, email: 'a@b.c', format_preferences: { hide_chords: false } },
  }),
  useUpdateCurrentUser: vi.fn<typeof useUpdateCurrentUser>(),
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
      onReactionListClick: vi.fn<MessageContextValue['onReactionListClick']>(),
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
    handleDelete: vi.fn<MessageContextValue['handleDelete']>(),
    handleFlag: vi.fn<MessageContextValue['handleFlag']>(),
    handleMute: vi.fn<MessageContextValue['handleMute']>(),
    handlePin: vi.fn<MessageContextValue['handlePin']>(),
    isMyMessage: () => mine,
    message: message(poll ? { attachments: [{ type: 'poll' }] } : {}),
    setEditingState: vi.fn<MessageContextValue['setEditingState']>(),
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
  const onChange =
    vi.fn<ComponentProps<typeof NotificationSetting>['onChange']>();
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

  fireEvent.click(screen.getByText('App (Push)'));
  expect(onChange).toHaveBeenLastCalledWith({ ...setting, push_enabled: true });
  expect(settingsApi.updateNotificationSetting).toHaveBeenLastCalledWith(7, {
    push_enabled: true,
  });

  // Text messages are gone.
  expect(screen.queryByText('Text message')).toBeNull();

  // Each channel is a switch in a segmented list, named by its row.
  const email = screen.getByRole('switch', { name: /Email/ });
  expect(email.closest('.list-segmented')).not.toBeNull();
  expect(screen.getAllByRole('switch')).toHaveLength(2);
});

test('NotificationSetting renders without a setting', () => {
  const { container } = render(
    <NotificationSetting
      setting={undefined}
      onChange={vi.fn<ComponentProps<typeof NotificationSetting>['onChange']>()}
    />
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

  expect(
    await screen.findByRole('heading', { name: 'Event reminder' })
  ).toBeInTheDocument();
  expect(screen.queryByText('Other')).toBeNull();
  expect(
    screen.getByRole('heading', { level: 1, name: 'Notifications' })
  ).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Back to account' })).toHaveAttribute(
    'href',
    '/account'
  );

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
  const onClick = vi.fn<ComponentProps<typeof TeamPlanOption>['onClick']>();
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
  expect(option).toHaveClass('mb-8', 'bg-surface-container');
  expect(option).toHaveAttribute('aria-checked', 'false');
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
  expect(option).toHaveClass('bg-primary-container', 'outline-primary');
  expect(option).toHaveAttribute('aria-checked', 'true');
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
  expect(screen.getByRole('heading', { name: 'Pro' })).toBeInTheDocument();
});

test('BillingPage summarizes Pro, with every feature included', () => {
  vi.mocked(useSubscription).mockReturnValue({
    data: { plan_name: 'Pro', price: 20, status: 'active', store: 'stripe' },
    isLoading: false,
    isError: false,
    isSuccess: true,
    isFetching: false,
    error: null,
  });
  renderWithProvider(<BillingPage />);
  const summary = screen
    .getByRole('heading', { name: 'Pro' })
    .closest('section')!;
  expect(summary).toHaveClass('bg-surface-container-low');
  expect(summary).toHaveTextContent('Current plan');
  expect(summary).toHaveTextContent('StatusActive');
  expect(screen.getByText('Active')).toHaveClass('bg-primary-container');
  expect(
    screen.getByText('Sessions').closest('li')!.querySelector('svg')
  ).toHaveClass('text-primary');
  expect(
    screen.getByRole('button', { name: 'Manage subscription' })
  ).toBeInTheDocument();
  expect(
    screen.queryByRole('button', { name: 'Upgrade to Pro' })
  ).not.toBeInTheDocument();
  // Nothing is marked Pro-only when you're on Pro.
  expect(screen.getByText('Sessions').closest('li')).not.toHaveClass(
    'text-on-surface-variant'
  );
});

test('BillingPage offers the upgrade on Free, marking the Pro features', () => {
  vi.mocked(useSubscription).mockReturnValue({
    data: { plan_name: 'Free', status: 'active' },
    isLoading: false,
    isError: false,
    isSuccess: true,
    isFetching: false,
    error: null,
  });
  renderWithProvider(<BillingPage />);
  expect(screen.getByRole('heading', { name: 'Free' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Upgrade to Pro' })).toHaveClass(
    'bg-primary'
  );
  const sessions = screen.getByText('Sessions').closest('li')!;
  expect(sessions).toHaveClass('text-on-surface-variant');
  expect(sessions).toHaveTextContent('Pro');
  expect(screen.getByText('Metronome').closest('li')).not.toHaveClass(
    'text-on-surface-variant'
  );
});

test('AccountAppearancePage saves the hide chords preference', () => {
  const run = vi.fn<ReturnType<typeof useUpdateCurrentUser>['run']>();
  vi.mocked(useUpdateCurrentUser).mockReturnValue({
    run,
    isLoading: false,
    isError: false,
    error: null,
  });
  render(
    <ThemeProvider>
      <MemoryRouter>
        <AccountAppearancePage />
      </MemoryRouter>
    </ThemeProvider>
  );
  expect(
    screen.getByRole('heading', { level: 1, name: 'Appearance' })
  ).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Back to account' })).toHaveAttribute(
    'href',
    '/account'
  );
  expect(screen.getByRole('heading', { name: 'Songs' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('switch', { name: /Show chords/ }));
  expect(run).toHaveBeenCalledWith({ prefers_hide_chords: true });
});

test('AccountAppearancePage switches the dark theme', () => {
  vi.mocked(useUpdateCurrentUser).mockReturnValue({
    run: vi.fn<ReturnType<typeof useUpdateCurrentUser>['run']>(),
    isLoading: false,
    isError: false,
    error: null,
  });
  localStorage.setItem('theme', 'light');
  render(
    <ThemeProvider>
      <MemoryRouter>
        <AccountAppearancePage />
      </MemoryRouter>
    </ThemeProvider>
  );
  expect(screen.getByRole('heading', { name: 'Theme' })).toBeInTheDocument();
  const dark = screen.getByRole('switch', { name: /Dark theme/ });
  expect(dark).not.toBeChecked();

  fireEvent.click(screen.getByText('Dark theme'));
  expect(dark).toBeChecked();
  expect(document.documentElement).toHaveClass('dark');
  expect(localStorage.getItem('theme')).toBe('dark');

  fireEvent.click(dark);
  expect(document.documentElement).not.toHaveClass('dark');
  localStorage.removeItem('theme');
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

  expect(screen.getByText('Connected')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Disconnect' }));
  await waitFor(() =>
    expect(store.getState().auth.currentUser).toEqual({
      ...currentUser,
      pco_connected: false,
    })
  );
  expect(PcoApi.disconnect).toHaveBeenCalled();
});

describe('AccountGeneralSettingsPage', () => {
  function renderPage(currentUser: object) {
    return renderWithProvider(
      <MemoryRouter initialEntries={['/account/settings']}>
        <AccountGeneralSettingsPage />
        <Route path="/login" exact>
          <p>Signed out</p>
        </Route>
      </MemoryRouter>,
      { preloadedState: { auth: { currentUser } } }
    );
  }

  test('goes back to the account menu and opens the profile', () => {
    renderPage({
      id: 1,
      email: 'a@b.c',
      first_name: 'Ada',
      last_name: 'Lovelace',
    });
    expect(
      screen.getByRole('heading', { level: 1, name: 'General' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Back to account' })
    ).toHaveAttribute('href', '/account');
    const profile = screen.getByRole('link', { name: /Ada Lovelace/ });
    expect(profile).toHaveAttribute('href', '/account/profile');
    expect(profile).toHaveTextContent('a@b.c');
  });

  test('asks for a name when there isn’t one', () => {
    renderPage({ id: 1, email: 'a@b.c' });
    expect(screen.getByRole('link', { name: /Add your name/ })).toHaveAttribute(
      'href',
      '/account/profile'
    );
  });

  test('lists the integrations and sign-out options as segmented lists', () => {
    renderPage({ id: 1, email: 'a@b.c', pco_connected: false });
    const planningCenter = screen.getByText('Planning Center');
    expect(planningCenter.closest('.list-segmented')).not.toBeNull();
    expect(screen.getByText('Not connected')).toBeInTheDocument();
    // Planning Center's own icon leads the row.
    expect(
      planningCenter.closest('.list-segmented > *')!.querySelector('img')
    ).toHaveAttribute('src', '/services.png');
    expect(
      screen.queryByRole('button', { name: 'Disconnect' })
    ).not.toBeInTheDocument();

    expect(screen.getByRole('link', { name: /Switch teams/ })).toHaveAttribute(
      'href',
      '/login/teams'
    );
    expect(screen.getByText('Log out')).toHaveClass('text-error');
  });

  test('logs out', () => {
    const { store } = renderPage({ id: 1, email: 'a@b.c' });
    fireEvent.click(screen.getByRole('button', { name: /Log out/ }));
    expect(store.getState().auth.currentUser).toBeFalsy();
    expect(screen.getByText('Signed out')).toBeInTheDocument();
  });
});

describe('AccountProfilePage', () => {
  function renderPage(currentUser: object) {
    return renderWithProvider(
      <MemoryRouter>
        <AccountProfilePage />
      </MemoryRouter>,
      { preloadedState: { auth: { currentUser } } }
    );
  }

  test('has the account header, and the photo and info on cards', () => {
    renderPage({ id: 1, email: 'a@b.c', image_url: 'me.png' });
    expect(
      screen.getByRole('heading', { level: 1, name: 'Profile' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Back to account' })
    ).toHaveAttribute('href', '/account');
    expect(
      screen.getByRole('button', { name: 'Change photo' }).closest('section')
    ).toHaveClass('rounded-extra-large-increased');
    expect(
      screen.getByRole('heading', { name: 'Personal info' }).closest('section')
    ).toHaveClass('rounded-extra-large-increased');
  });

  test('offers Add photo, and no Remove, without a photo', () => {
    renderPage({ id: 1, email: 'a@b.c' });
    expect(
      screen.getByRole('button', { name: 'Add photo' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Remove' })
    ).not.toBeInTheDocument();
  });

  test('saves an edited name', async () => {
    const currentUser = { id: 1, email: 'a@b.c', first_name: 'Ada' };
    vi.mocked(UserApi.updateCurrentUser).mockResolvedValue(
      // `as`: the page reads only `data`.
      { data: { ...currentUser, first_name: 'Grace' } } as Awaited<
        ReturnType<typeof UserApi.updateCurrentUser>
      >
    );
    const { store } = renderPage(currentUser);
    const save = screen.getByRole('button', { name: 'Save' });
    expect(save).toBeDisabled();
    // Just the name: no phone number now that there are no text messages.
    expect(screen.getAllByRole('textbox')).toHaveLength(2);
    expect(screen.queryByText('Phone number')).toBeNull();

    fireEvent.change(screen.getByDisplayValue('Ada'), {
      target: { value: 'Grace' },
    });
    fireEvent.click(save);
    await waitFor(() =>
      expect(store.getState().auth.currentUser?.first_name).toBe('Grace')
    );
    expect(UserApi.updateCurrentUser).toHaveBeenCalledWith({
      first_name: 'Grace',
    });
    expect(save).toBeDisabled();
  });
});

describe('ProfilePictureDetail', () => {
  const currentUser = { id: 1, email: 'a@b.c', image_url: 'old.png' };

  beforeEach(() => {
    URL.createObjectURL = vi.fn<typeof URL.createObjectURL>(() => 'blob:temp');
    URL.revokeObjectURL = vi.fn<typeof URL.revokeObjectURL>();
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
