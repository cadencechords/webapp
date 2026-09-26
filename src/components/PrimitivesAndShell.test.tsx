import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProvider } from '../utils/test';
import UserApi from '../api/UserApi';
import { MANAGE_BILLING, REMOVE_MEMBERS } from '../utils/constants';
import AppFallback from './AppFallback';
import Badge from './Badge';
import ButtonGroup from './ButtonGroup';
import Drawer from './Drawer';
import KeyBadge from './KeyBadge';
import NoTeamYet from './NoTeamYet';
import NumberBadge from './NumberBadge';
import QuickAdd from './QuickAdd';
import SegmentedControl from './SegmentedControl';
import Sidenav from './Sidenav';
import TextAutosize from './TextAutosize';
import ButtonSwitch from './buttons/ButtonSwitch';
import CalendarDateButton from './buttons/CalendarDateButton';
import SongKeyButton from './buttons/SongKeyButton';
import MemberMenu from './mobile menus/MemberMenu';
import MobileProfilePictureMenu from './mobile menus/MobileProfilePictureMenu';
import BinderIcon from '../icons/BinderIcon';
import BoldIcon from '../icons/BoldIcon';
import { PencilIcon } from '../icons/AnnotationIcons';

// Pins the behavior of the files converted in CAD-129.

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

test('Badge defaults to blue and appends its class', () => {
  render(
    <>
      <Badge className="ml-2">Default</Badge>
      <Badge className="mr-2" color="green">
        Trialing
      </Badge>
    </>
  );
  expect(screen.getByText('Default')).toHaveClass('bg-blue-100', 'ml-2');
  expect(screen.getByText('Trialing')).toHaveClass('bg-green-100', 'mr-2');
});

test('ButtonGroup reports the clicked option and whether it becomes selected', () => {
  const onChange = vi.fn();
  const options = [
    { value: 'bold', display: 'B' },
    { value: 'italic', display: 'I' },
  ];
  render(
    <ButtonGroup options={options} selected={['bold']} onChange={onChange} />
  );
  expect(screen.getByText('B')).toHaveClass('bg-gray-700');
  expect(screen.getByText('I')).not.toHaveClass('bg-gray-700');
  fireEvent.click(screen.getByText('B'));
  expect(onChange).toHaveBeenLastCalledWith({
    selected: false,
    option: options[0],
  });
  fireEvent.click(screen.getByText('I'));
  expect(onChange).toHaveBeenLastCalledWith({
    selected: true,
    option: options[1],
  });
});

test('SegmentedControl checks the selected option and reports changes', () => {
  const onChange = vi.fn();
  render(
    <SegmentedControl
      options={['General', 'Chords']}
      selected="General"
      onChange={onChange}
      name="tabs"
      size="sm"
    />
  );
  expect(screen.getByLabelText('General')).toBeChecked();
  expect(screen.getByText('Chords')).toHaveClass('text-xs');
  fireEvent.click(screen.getByLabelText('Chords'));
  expect(onChange).toHaveBeenCalledWith('Chords');
});

test('ButtonSwitch reports clicks on the inactive label only', () => {
  const onClick = vi.fn();
  render(
    <ButtonSwitch
      buttonLabels={['Major', 'Minor']}
      activeButtonLabel="Major"
      onClick={onClick}
    />
  );
  fireEvent.click(screen.getByText('Major'));
  expect(onClick).not.toHaveBeenCalled();
  fireEvent.click(screen.getByText('Minor'));
  expect(onClick).toHaveBeenCalledWith('Minor');
});

test('KeyBadge renders nothing without a key', () => {
  expect(render(<KeyBadge />).container.innerHTML).toBe('');
  expect(render(<KeyBadge songKey="G" />).container).toHaveTextContent('G');
});

test('SongKeyButton disables the blank key', () => {
  const onClick = vi.fn();
  render(
    <>
      <SongKeyButton songKey="" onClick={onClick} selected={false} />
      <SongKeyButton songKey="A" onClick={onClick} selected />
    </>
  );
  const [blank, a] = screen.getAllByRole('button');
  expect(blank).toBeDisabled();
  expect(a).toHaveClass('ring-4');
  fireEvent.click(a);
  expect(onClick).toHaveBeenCalledTimes(1);
});

test('NumberBadge and CalendarDateButton style their states', () => {
  render(
    <>
      <NumberBadge className="mr-2" disabled>
        3
      </NumberBadge>
      <CalendarDateButton selected className="mb-2">
        14
      </CalendarDateButton>
    </>
  );
  expect(screen.getByText('3')).toHaveClass('bg-gray-100', 'mr-2');
  expect(screen.getByText('14')).toHaveClass('bg-blue-600', 'mb-2');
});

test('TextAutosize sets the font size in px unless autosizing', () => {
  render(<TextAutosize fontSize={18}>Lyrics</TextAutosize>);
  expect(screen.getByText('Lyrics')).toHaveStyle({ fontSize: '18px' });
});

test('TextAutosize fits the text to its container when autosizing', () => {
  render(
    <TextAutosize autosize fontSize={18}>
      Chorus
    </TextAutosize>
  );
  const text = screen.getByText('Chorus');
  expect(text).not.toHaveStyle({ fontSize: '18px' });
  expect(text.closest('div[style*="height: 100%"]')).not.toBeNull();
});

test('Drawer closes from its backdrop and slides in when open', () => {
  const onClose = vi.fn();
  const { container } = render(
    <Drawer open onClose={onClose}>
      Adjustments
    </Drawer>
  );
  expect(screen.getByText('Adjustments')).toHaveClass('translate-x-0');
  // Non-null: the backdrop is the first element; the drawer is the <aside>.
  fireEvent.click(container.firstElementChild!);
  expect(onClose).toHaveBeenCalled();
});

test('QuickAdd calls onAdd', () => {
  const onAdd = vi.fn();
  render(<QuickAdd onAdd={onAdd} />);
  fireEvent.click(screen.getByRole('button'));
  expect(onAdd).toHaveBeenCalled();
});

test('AppFallback and NoTeamYet keep their apostrophes', () => {
  render(
    <MemoryRouter>
      <AppFallback error={new Error('boom')} />
      <NoTeamYet />
    </MemoryRouter>
  );
  expect(
    screen.getByText(/We've been notified of the issue\./)
  ).toBeInTheDocument();
  expect(
    screen.getByText("Looks like you aren't a part of any teams yet")
  ).toBeInTheDocument();
});

test('icons pass their class, and BoldIcon defaults to an empty one', () => {
  const { container } = render(
    <>
      <BinderIcon className="h-5 w-5" />
      <BoldIcon />
      <PencilIcon />
    </>
  );
  const [binder, bold, pencil] = container.querySelectorAll('svg');
  expect(binder).toHaveAttribute('class', 'h-5 w-5');
  expect(bold).toHaveAttribute('class', '');
  expect(pencil).not.toHaveAttribute('class');
});

test('MobileProfilePictureMenu deletes the image, then closes', () => {
  const calls: string[] = [];
  render(
    <MobileProfilePictureMenu
      open
      onCloseDialog={() => calls.push('close')}
      onOpenFileDialog={() => calls.push('open file')}
      onDeleteImage={() => calls.push('delete')}
    />
  );
  fireEvent.click(screen.getByText('Remove photo'));
  expect(calls).toEqual(['delete', 'close']);
});

function memberState(permissions: string[]) {
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

test('MemberMenu titles the member and removes them from the team', async () => {
  const deleteMembership = vi
    .spyOn(UserApi, 'deleteMembership')
    .mockResolvedValue(
      // Only awaited: MemberMenu reads nothing from the response.
      {} as Awaited<ReturnType<typeof UserApi.deleteMembership>>
    );
  const onRemoved = vi.fn();
  renderWithProvider(
    <MemberMenu
      open
      onCloseDialog={() => {}}
      member={{
        id: 7,
        email: 'ann@example.com',
        first_name: 'Ann',
        last_name: 'Lee',
      }}
      onRemoved={onRemoved}
    />,
    { preloadedState: memberState([REMOVE_MEMBERS]) }
  );
  expect(screen.getByText('Ann Lee')).toBeInTheDocument();
  fireEvent.click(screen.getByText('Remove from team'));
  await waitFor(() => expect(onRemoved).toHaveBeenCalledWith(7));
  expect(deleteMembership).toHaveBeenCalledWith(7);
  deleteMembership.mockRestore();
});

test('MemberMenu falls back to the email, and hides removal without the permission', () => {
  renderWithProvider(
    <MemberMenu
      open
      onCloseDialog={() => {}}
      member={{ id: 7, email: 'ann@example.com' }}
      onRemoved={() => {}}
    />,
    { preloadedState: memberState([]) }
  );
  expect(screen.getByText('ann@example.com')).toBeInTheDocument();
  expect(screen.queryByText('Remove from team')).not.toBeInTheDocument();
});

test('MemberMenu hides removal without a member', () => {
  renderWithProvider(
    <MemberMenu
      open
      onCloseDialog={() => {}}
      member={null}
      onRemoved={() => {}}
    />,
    { preloadedState: memberState([REMOVE_MEMBERS]) }
  );
  expect(screen.queryByText('Remove from team')).not.toBeInTheDocument();
});

test('Sidenav shows the links the member can use', () => {
  renderWithProvider(
    <MemoryRouter>
      <Sidenav />
    </MemoryRouter>,
    { preloadedState: memberState([MANAGE_BILLING]) }
  );
  expect(screen.getByText('Songs')).toBeInTheDocument();
  expect(screen.getByText('Billing')).toBeInTheDocument();
  expect(screen.queryByText('Permissions')).not.toBeInTheDocument();
  expect(screen.queryByText('Calendar')).not.toBeInTheDocument();
});
