import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { useEffect, type ComponentProps, type ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import type { AxiosResponse } from 'axios';
import EventsApi from '../api/eventsApi';
import SetlistApi from '../api/SetlistApi';
import TeamApi from '../api/TeamApi';
import EventFormProvider from '../contexts/EventFormProvider';
import useEventForm from '../hooks/forms/useEventForm';
import {
  fromEventForm,
  hasDifferentMembers,
  hasDifferentReminderTimes,
  hasDifferentSetlist,
  hasDifferentTimes,
  toEventForm,
} from '../utils/event.utils';
import { isEventValid } from '../validators/event';
import { renderWithProvider } from '../utils/test';
import Calendar from './calendar/Calendar';
import CalendarBody from './calendar/CalendarBody';
import CalendarEventEntry from './calendar/CalendarEventEntry';
import CalendarHeader from './calendar/CalendarHeader';
import EventDetail from './EventDetail';
import EventDetailSheet from './EventDetailSheet';
import EventFormSetlistPanel from './EventFormSetlistPanel';
import EventMembers from './EventMembers';
import ReminderTimesListBox from '../ReminderTimesListBox';
import WizardStepLink from '../wizards/WizardStepLink';
import { getCalendarDates } from '../utils/date';
import type {
  CalendarEvent,
  EventForm,
  EventMembership,
  Membership,
  Role,
  Setlist,
} from '../types';

vi.mock('../api/eventsApi', () => ({
  default: { delete: vi.fn<typeof EventsApi.delete>() },
}));
vi.mock('../api/SetlistApi', () => ({
  default: {
    getAll: vi.fn<typeof SetlistApi.getAll>(),
    getOne: vi.fn<typeof SetlistApi.getOne>(),
  },
}));
vi.mock('../api/TeamApi', () => ({
  default: { getMemberships: vi.fn<typeof TeamApi.getMemberships>() },
}));

/**
 * A response with just `data`. A cast, because the hooks read nothing else
 * of an `AxiosResponse`.
 */
const response = <T,>(data: T) => ({ data }) as AxiosResponse<T>;

const role: Role = { id: 1, name: 'Member' };
const ana: Membership = {
  id: 1,
  role,
  user: { id: 1, email: 'x1@example.com', first_name: 'Ana', last_name: 'Li' },
};
const bo: Membership = {
  id: 2,
  role,
  user: { id: 2, email: 'bo@example.com' },
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('event.utils', () => {
  test('toEventForm fills the defaults and splits the start time', () => {
    const form = toEventForm({
      id: 3,
      start_time: '2024-05-10T19:30:00',
      end_time: '2024-05-10T21:00:00',
    });
    expect(form).toMatchObject({
      id: 3,
      title: '',
      description: '',
      color: 'blue',
      memberships: [],
      reminders_enabled: false,
      remind_number_of_hours_before: 1,
      startDate: '2024-05-10',
      startTime: '7:30 PM',
      endTime: '9:00 PM',
    });
  });

  test('toEventForm leaves the time empty at midnight and reads the reminder', () => {
    const form = toEventForm({
      id: 3,
      color: 'red',
      start_time: '2024-05-10T00:00:00',
      reminders_enabled: true,
      reminder_date: '2024-05-09T00:00:00',
    });
    expect(form.startTime).toBe('');
    expect(form.color).toBe('red');
    expect(form.remind_number_of_hours_before).toBe(24);
  });

  test('fromEventForm builds the request', () => {
    const setlist: Setlist = { id: 9, name: 'Sunday' };
    const form: EventForm = {
      title: 'Practice',
      description: '',
      color: 'green',
      memberships: [ana, bo],
      reminders_enabled: true,
      remind_number_of_hours_before: 2,
      startDate: '2024-05-10',
      startTime: '7:30 PM',
      endTime: '9:00 PM',
      setlist,
    };
    const event = fromEventForm(form);
    expect(event).toEqual({
      title: 'Practice',
      description: '',
      color: 'green',
      reminders_enabled: true,
      setlist_id: 9,
      start_time: new Date(2024, 4, 10, 19, 30),
      end_time: new Date(2024, 4, 10, 21, 0),
      membership_ids: [1, 2],
      reminder_date: new Date(2024, 4, 10, 17, 30),
    });
  });

  test('fromEventForm leaves out reminders when they are off', () => {
    const event = fromEventForm({
      title: 'Practice',
      description: '',
      memberships: [ana],
      reminders_enabled: false,
      remind_number_of_hours_before: 2,
      startDate: '2024-05-10',
      startTime: '',
    });
    expect(event.setlist_id).toBeNull();
    expect(event.start_time).toEqual(new Date(2024, 4, 10));
    expect(event).not.toHaveProperty('end_time');
    expect(event).not.toHaveProperty('membership_ids');
    expect(event).not.toHaveProperty('reminder_date');
  });

  test('hasDifferentMembers compares the ids as sets', () => {
    expect(hasDifferentMembers([1, 2], [1, 2])).toBe(false);
    expect(hasDifferentMembers([1, 2], [1, 3])).toBe(true);
    expect(hasDifferentMembers(undefined, undefined)).toBe(false);
  });

  test('hasDifferentSetlist compares the ids', () => {
    expect(hasDifferentSetlist(null, undefined)).toBe(false);
    expect(hasDifferentSetlist({ id: 1 }, null)).toBe(true);
    expect(hasDifferentSetlist(null, { id: 1 })).toBe(true);
    expect(hasDifferentSetlist({ id: 1 }, { id: 1 })).toBe(false);
    expect(hasDifferentSetlist({ id: 1 }, { id: 2 })).toBe(true);
  });

  test('hasDifferentTimes compares to the minute', () => {
    expect(hasDifferentTimes(null, null)).toBe(false);
    expect(hasDifferentTimes('2024-05-10T19:30:00', null)).toBe(true);
    expect(hasDifferentTimes(null, '2024-05-10T19:30:00')).toBe(true);
    expect(
      hasDifferentTimes('2024-05-10T19:30:10', '2024-05-10T19:30:50')
    ).toBe(false);
    expect(
      hasDifferentTimes('2024-05-10T19:30:00', '2024-05-10T19:31:00')
    ).toBe(true);
  });

  test('hasDifferentReminderTimes compares to the hour', () => {
    expect(hasDifferentReminderTimes(undefined, undefined)).toBe(false);
    expect(hasDifferentReminderTimes('2024-05-10T19:30:00', null)).toBe(true);
    expect(hasDifferentReminderTimes(null, '2024-05-10T19:30:00')).toBe(true);
    expect(
      hasDifferentReminderTimes('2024-05-10T19:05:00', '2024-05-10T19:55:00')
    ).toBe(false);
    expect(
      hasDifferentReminderTimes('2024-05-10T19:30:00', '2024-05-10T20:30:00')
    ).toBe(true);
  });
});

describe('isEventValid', () => {
  test('needs a title and a date', () => {
    expect(isEventValid({ title: 'Practice', date: '2024-05-10' })).toBe(true);
    expect(isEventValid({ title: '', date: '2024-05-10' })).toBe(false);
    expect(isEventValid({ title: 'Practice' })).toBe(false);
  });

  test('checks the start and end times, ignoring AM and PM', () => {
    const valid = { title: 'Practice', date: '2024-05-10' };
    expect(isEventValid({ ...valid, startTime: '7:30PM' })).toBe(true);
    expect(isEventValid({ ...valid, startTime: '13:30AM' })).toBe(false);
    expect(isEventValid({ ...valid, startTime: '7:75PM' })).toBe(false);
    expect(isEventValid({ ...valid, endTime: '9:00AM' })).toBe(true);
    expect(isEventValid({ ...valid, endTime: '0:00PM' })).toBe(false);
    expect(isEventValid({ ...valid, endTime: '9:60PM' })).toBe(false);
  });
});

/** Renders `hook` inside an EventFormProvider and returns its live value. */
function renderEventForm(children?: ReactNode) {
  const result: { current?: ReturnType<typeof useEventForm> } = {};
  function Probe() {
    const value = useEventForm();
    useEffect(() => {
      result.current = value;
    });
    return null;
  }
  const rendered = renderWithProvider(
    <MemoryRouter>
      <EventFormProvider>
        <Probe />
        {children}
      </EventFormProvider>
    </MemoryRouter>
  );
  return { result, ...rendered };
}

describe('useEventForm', () => {
  test('onChange sets one field and clearForm resets the form', () => {
    const { result } = renderEventForm();

    act(() => result.current?.onChange('title', 'Practice'));
    act(() => result.current?.onChange('startTime', null));
    expect(result.current?.form.title).toBe('Practice');
    expect(result.current?.form.startTime).toBeNull();
    expect(result.current?.form.color).toBe('blue');

    act(() => result.current?.clearForm());
    expect(result.current?.form).toEqual({
      title: '',
      description: '',
      color: 'blue',
      memberships: [],
      remind_number_of_hours_before: 1,
    });
  });

  test('setForm fills the form from an event', () => {
    const { result } = renderEventForm();
    act(() =>
      result.current?.setForm({
        id: 4,
        title: 'Rehearsal',
        start_time: '2024-05-10T19:30:00',
      })
    );
    expect(result.current?.form).toMatchObject({
      id: 4,
      title: 'Rehearsal',
      startDate: '2024-05-10',
      startTime: '7:30 PM',
    });
  });
});

describe('EventFormSetlistPanel', () => {
  test("lists the team's sets newest first and toggles the chosen one", async () => {
    vi.mocked(SetlistApi.getAll).mockResolvedValue(
      response<Setlist[]>([
        { id: 1, name: 'Older set', scheduled_date: '2024-01-01' },
        { id: 2, name: 'Newer set', scheduled_date: '2024-02-01' },
      ])
    );
    const { result } = renderEventForm(<EventFormSetlistPanel />);

    expect(await screen.findByText("Your team's sets")).toBeInTheDocument();
    const names = screen
      .getAllByText(/set$/)
      .map(element => element.textContent?.trim());
    expect(names).toEqual(['Newer set', 'Older set']);

    fireEvent.click(screen.getByText('Older set'));
    expect(result.current?.form.setlist?.id).toBe(1);

    fireEvent.click(screen.getByText('Older set'));
    expect(result.current?.form.setlist).toBeNull();
  });
});

describe('EventMembers', () => {
  function renderMembers(members: EventMembership[] = []) {
    vi.mocked(TeamApi.getMemberships).mockResolvedValue(
      response<Membership[]>([ana, bo])
    );
    const onChange = vi.fn<ComponentProps<typeof EventMembers>['onChange']>();
    renderWithProvider(<EventMembers members={members} onChange={onChange} />);
    return onChange;
  }

  test('filters by first name, last name or email', async () => {
    renderMembers();
    await screen.findByText('bo@example.com');

    fireEvent.change(screen.getByPlaceholderText('Search'), {
      target: { value: 'li' },
    });
    expect(screen.getByText('Ana Li')).toBeInTheDocument();
    expect(screen.queryByText('bo@example.com')).not.toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText('Search'), {
      target: { value: 'ana' },
    });
    expect(screen.getByText('Ana Li')).toBeInTheDocument();
    expect(screen.queryByText('bo@example.com')).not.toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText('Search'), {
      target: { value: 'bo@' },
    });
    expect(screen.queryByText('Ana Li')).not.toBeInTheDocument();
    expect(screen.getByText('bo@example.com')).toBeInTheDocument();
  });

  test('checks and unchecks members', async () => {
    const onChange = renderMembers([ana]);
    await screen.findByText('bo@example.com');

    fireEvent.click(screen.getByText('bo@example.com'));
    expect(onChange).toHaveBeenLastCalledWith([ana, bo]);

    fireEvent.click(screen.getByText('Ana Li'));
    expect(onChange).toHaveBeenLastCalledWith([]);

    fireEvent.click(screen.getByText('Check all'));
    expect(onChange).toHaveBeenLastCalledWith([ana, bo]);
  });
});

const event: CalendarEvent = {
  id: 7,
  title: 'Practice',
  color: 'red',
  start_time: '2024-05-10T19:30:00',
  description: 'Bring music',
  memberships: [ana, bo],
};

/** The current user, allowed to do everything with events. */
const eventPermissions = {
  auth: {
    currentUser: {
      id: 1,
      email: 'ana@example.com',
      role: {
        id: 1,
        name: 'Admin',
        permissions: [{ name: 'Edit events' }, { name: 'Delete events' }],
      },
    },
  },
};

type EventDetailSheetProps = ComponentProps<typeof EventDetailSheet>;

describe('EventDetailSheet', () => {
  function renderSheet(sheetEvent: CalendarEvent | null) {
    const onDeleted = vi.fn<EventDetailSheetProps['onDeleted']>();
    const onCloseDialog = vi.fn<EventDetailSheetProps['onCloseDialog']>();
    const rendered = renderWithProvider(
      <MemoryRouter>
        <EventFormProvider>
          <EventDetailSheet
            event={sheetEvent}
            onDeleted={onDeleted}
            onCloseDialog={onCloseDialog}
          />
        </EventFormProvider>
      </MemoryRouter>,
      { preloadedState: eventPermissions }
    );
    return { onDeleted, onCloseDialog, ...rendered };
  }

  test('lists the members by name or email', () => {
    renderSheet(event);
    expect(screen.getByText('Ana Li')).toBeInTheDocument();
    expect(screen.getByText('bo@example.com')).toBeInTheDocument();
    expect(screen.queryByText('No members')).not.toBeInTheDocument();
    expect(screen.getByText('Bring music')).toBeInTheDocument();
  });

  test('says when there are no members', () => {
    renderSheet({ ...event, memberships: [] });
    expect(screen.getByText('No members')).toBeInTheDocument();

    renderSheet({ ...event, memberships: undefined });
    expect(screen.getAllByText('No members')).toHaveLength(2);
  });

  test('deletes the event', () => {
    const { onDeleted, onCloseDialog } = renderSheet(event);
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[buttons.length - 1]);

    expect(EventsApi.delete).toHaveBeenCalledWith(7);
    expect(onDeleted).toHaveBeenCalledWith(7);
    expect(onCloseDialog).toHaveBeenCalled();
  });

  test('links to editing the event', () => {
    renderSheet(event);
    expect(
      screen.getAllByRole('link').map(link => link.getAttribute('href'))
    ).toContain('/calendar/7/edit');
  });

  test('renders nothing without an event', () => {
    const { container } = renderSheet(null);
    expect(container).toBeEmptyDOMElement();
  });
});

type EventDetailProps = ComponentProps<typeof EventDetail>;

describe('EventDetail', () => {
  test('lists the members, or says there are none', () => {
    const { rerender } = render(<EventDetail event={event} />);
    expect(screen.getByText('Ana Li')).toBeInTheDocument();
    expect(screen.getByText('bo@example.com')).toBeInTheDocument();

    rerender(<EventDetail event={{ ...event, memberships: [] }} />);
    expect(screen.getByText('No members')).toBeInTheDocument();

    rerender(<EventDetail event={{ ...event, memberships: undefined }} />);
    expect(screen.getByText('No members')).toBeInTheDocument();
  });

  test('shows the buttons the member may use', () => {
    const onDelete = vi.fn<NonNullable<EventDetailProps['onDelete']>>();
    const onEdit = vi.fn<NonNullable<EventDetailProps['onEdit']>>();
    const currentMember = {
      id: 1,
      email: 'ana@example.com',
      permissions: ['Delete events'],
      can: (permission: string) => permission === 'Delete events',
    };
    render(
      <EventDetail
        event={event}
        currentMember={currentMember}
        onDelete={onDelete}
        onEdit={onEdit}
      />
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(1);
    fireEvent.click(buttons[0]);
    expect(onDelete).toHaveBeenCalled();
    expect(onEdit).not.toHaveBeenCalled();
  });
});

type CalendarProps = ComponentProps<typeof Calendar>;
type CalendarBodyProps = ComponentProps<typeof CalendarBody>;
type CalendarHeaderProps = ComponentProps<typeof CalendarHeader>;

describe('calendar', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  test('CalendarEventEntry shows the time and title in the event color', () => {
    const onClick = vi.fn<(event: CalendarEvent) => void>();
    render(<CalendarEventEntry event={event} onClick={onClick} />);
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('7:30pm Practice');
    expect(button.className).toContain('bg-red-500');

    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledWith(event);
  });

  test('CalendarEventEntry is black text without a color', () => {
    render(
      <CalendarEventEntry
        event={{ ...event, color: undefined }}
        onClick={vi.fn<(event: CalendarEvent) => void>()}
      />
    );
    expect(screen.getByRole('button').className).toContain('text-black');
  });

  test('CalendarEventEntry follows its event color, including to none', () => {
    const { rerender } = render(
      <CalendarEventEntry
        event={event}
        onClick={vi.fn<(event: CalendarEvent) => void>()}
      />
    );
    rerender(
      <CalendarEventEntry
        event={{ ...event, color: undefined }}
        onClick={vi.fn<(event: CalendarEvent) => void>()}
      />
    );
    const button = screen.getByRole('button');
    expect(button.className).toContain('text-black');
    expect(button.className).not.toContain('bg-red-500');
  });

  test('Calendar opens the clicked event', () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(2024, 4, 1));
    // headlessui's Dialog can use ResizeObserver, which jsdom doesn't have.
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
      }
    );
    renderWithProvider(
      <MemoryRouter>
        <EventFormProvider>
          <Calendar
            events={[event]}
            onEventDeleted={vi.fn<CalendarProps['onEventDeleted']>()}
            onEventUpdated={vi.fn<CalendarProps['onEventUpdated']>()}
          />
        </EventFormProvider>
      </MemoryRouter>,
      { preloadedState: eventPermissions }
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText(/Practice/));
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText('Practice')).toBeInTheDocument();
    expect(within(dialog).getByText('Bring music')).toBeInTheDocument();
  });

  test('Calendar shows the events of the month it moves to', () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(2026, 8, 15));
    const september = {
      ...event,
      id: 1,
      title: 'Practice',
      start_time: '2026-09-20T19:30:00',
    };
    const october = {
      ...event,
      id: 2,
      title: 'Retreat',
      start_time: '2026-10-03T09:00:00',
    };
    const calendar = (events: CalendarEvent[]) => (
      <Calendar
        events={events}
        onEventDeleted={vi.fn<CalendarProps['onEventDeleted']>()}
        onEventUpdated={vi.fn<CalendarProps['onEventUpdated']>()}
      />
    );
    const { rerender } = render(calendar([september]));
    expect(screen.getByText('September 2026')).toBeInTheDocument();
    expect(screen.getByText(/Practice/)).toBeInTheDocument();

    // The header's buttons are previous, then next.
    fireEvent.click(screen.getAllByRole('button')[1]);
    expect(screen.getByText('October 2026')).toBeInTheDocument();
    expect(screen.queryByText(/Practice/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Retreat/)).not.toBeInTheDocument();

    rerender(calendar([september, october]));
    expect(screen.getByText(/Retreat/)).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button')[0]);
    expect(screen.getByText('September 2026')).toBeInTheDocument();
    expect(screen.getByText(/Practice/)).toBeInTheDocument();
  });

  test.each([
    ['February 2015', 1, 2015, 4],
    ['May 2024', 4, 2024, 5],
    ['March 2024', 2, 2024, 6],
  ])('CalendarBody shows a row per week of %s', (_, month, year, rowCount) => {
    const { container } = render(
      <CalendarBody
        weeks={getCalendarDates(month, year)}
        events={[]}
        onEventClick={vi.fn<CalendarBodyProps['onEventClick']>()}
      />
    );
    expect(container.firstElementChild?.children).toHaveLength(rowCount);
  });

  test('CalendarBody shows the events on their days', () => {
    const onEventClick = vi.fn<CalendarBodyProps['onEventClick']>();
    render(
      <CalendarBody
        weeks={getCalendarDates(4, 2024)}
        events={[event]}
        onEventClick={onEventClick}
      />
    );
    fireEvent.click(screen.getByText(/Practice/));
    expect(onEventClick).toHaveBeenCalledWith(event);
  });

  test('CalendarBody renders nothing without weeks', () => {
    const { container } = render(
      <CalendarBody
        events={[]}
        onEventClick={vi.fn<CalendarBodyProps['onEventClick']>()}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });

  test('CalendarHeader changes the month and offers a new event', () => {
    const onNextMonth = vi.fn<CalendarHeaderProps['onNextMonth']>();
    const onPreviousMonth = vi.fn<CalendarHeaderProps['onPreviousMonth']>();
    const { rerender } = render(
      <MemoryRouter>
        <CalendarHeader
          title="May 2024"
          onNextMonth={onNextMonth}
          onPreviousMonth={onPreviousMonth}
        />
      </MemoryRouter>
    );
    expect(screen.getByText('May 2024')).toBeInTheDocument();
    expect(screen.queryByText('New event')).not.toBeInTheDocument();

    const [previous, next] = screen.getAllByRole('button');
    fireEvent.click(previous);
    expect(onPreviousMonth).toHaveBeenCalledTimes(1);
    fireEvent.click(next);
    expect(onNextMonth).toHaveBeenCalledTimes(1);

    rerender(
      <MemoryRouter>
        <CalendarHeader
          title="May 2024"
          onNextMonth={onNextMonth}
          onPreviousMonth={onPreviousMonth}
          canCreate
        />
      </MemoryRouter>
    );
    expect(screen.getByText('New event').closest('a')).toHaveAttribute(
      'href',
      '/calendar/new'
    );
  });
});

type ReminderTimesListBoxProps = ComponentProps<typeof ReminderTimesListBox>;

describe('ReminderTimesListBox', () => {
  test('shows the selected time, or 1 hour before', () => {
    const { rerender } = render(
      <ReminderTimesListBox
        selectedTime={24}
        onChange={vi.fn<ReminderTimesListBoxProps['onChange']>()}
      />
    );
    expect(screen.getByRole('button')).toHaveTextContent('1 day before');

    rerender(
      <ReminderTimesListBox
        onChange={vi.fn<ReminderTimesListBoxProps['onChange']>()}
      />
    );
    expect(screen.getByRole('button')).toHaveTextContent('1 hour before');
  });

  test('reports the hours of the chosen time', async () => {
    const onChange = vi.fn<ReminderTimesListBoxProps['onChange']>();
    render(<ReminderTimesListBox selectedTime={1} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(await screen.findByText('1 week before'));
    await waitFor(() => expect(onChange).toHaveBeenCalledWith(168));
  });
});

describe('WizardStepLink', () => {
  test('highlights the active step', () => {
    const onClick =
      vi.fn<NonNullable<ComponentProps<typeof WizardStepLink>['onClick']>>();
    const { rerender } = render(
      <WizardStepLink active className="extra" onClick={onClick}>
        Details
      </WizardStepLink>
    );
    const button = screen.getByRole('button', { name: 'Details' });
    expect(button.className).toContain('bg-blue-100');
    expect(button.className).toContain('extra');
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalled();

    rerender(<WizardStepLink>Details</WizardStepLink>);
    expect(screen.getByRole('button').className).toContain('text-gray-600');
  });
});
