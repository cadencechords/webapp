import React from 'react';
import useEventForm from '../hooks/forms/useEventForm';
import Toggle from './Toggle';
import EventMembers from './EventMembers';
import ReminderTimesListBox from '../ReminderTimesListBox';

export default function EventFormRemindersPanel() {
  const { form, onChange } = useEventForm();
  const { reminders_enabled, memberships, remind_number_of_hours_before } =
    form;

  return (
    <div>
      <div className="flex items-center gap-2 mb-6 font-semibold">
        Remind members?
        <Toggle
          onChange={toggleValue => onChange('reminders_enabled', toggleValue)}
          enabled={reminders_enabled}
        />
      </div>

      {reminders_enabled && (
        <>
          <div className="mb-8">
            <div className="mb-3 font-semibold">Send reminder</div>
            <ReminderTimesListBox
              onChange={value =>
                onChange('remind_number_of_hours_before', value)
              }
              selectedTime={remind_number_of_hours_before}
            />
          </div>
          <div>
            <EventMembers
              members={memberships}
              onChange={newMembers => onChange('memberships', newMembers)}
            />
          </div>
        </>
      )}
    </div>
  );
}
