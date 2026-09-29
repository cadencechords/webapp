import useEventForm from '../hooks/forms/useEventForm';
import Toggle from './Toggle';
import EventMembers from './EventMembers';
import ReminderTimesListBox from '../ReminderTimesListBox';
import { LIST_ITEM_TWO_LINE, LIST_SUPPORTING_TEXT } from './lists/listItem';

// Reminders as a switch list item; once on, when to send them and to whom.
export default function EventFormRemindersPanel() {
  const { form, onChange } = useEventForm();
  const { reminders_enabled, memberships, remind_number_of_hours_before } =
    form;

  return (
    <div>
      <div className="list-segmented">
        <div className={LIST_ITEM_TWO_LINE}>
          <div className="flex-1 min-w-0">
            <div>Remind members</div>
            <div className={LIST_SUPPORTING_TEXT}>
              Send a notification before the event
            </div>
          </div>
          <Toggle
            onChange={toggleValue => onChange('reminders_enabled', toggleValue)}
            enabled={reminders_enabled}
            label={<span className="sr-only">Remind members</span>}
          />
        </div>
      </div>

      {reminders_enabled && (
        <div className="flex flex-col gap-6 mt-6">
          <ReminderTimesListBox
            onChange={value => onChange('remind_number_of_hours_before', value)}
            selectedTime={remind_number_of_hours_before}
          />
          <EventMembers
            members={memberships}
            onChange={newMembers => onChange('memberships', newMembers)}
          />
        </div>
      )}
    </div>
  );
}
