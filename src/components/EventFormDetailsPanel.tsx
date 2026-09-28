import useEventForm from '../hooks/forms/useEventForm';
import OutlinedInput from './inputs/OutlinedInput';
import TimeInput from './inputs/TimeInput';

// The event's title, description, date and times as M3 outlined fields with
// floating labels.
export default function EventFormDetailsPanel() {
  const { form, onChange } = useEventForm();
  const { title, description, startDate, startTime, endTime } = form;
  return (
    <div className="flex flex-col gap-6">
      <OutlinedInput
        label="Title*"
        value={title}
        onChange={value => onChange('title', value)}
        supportingText="*required"
      />
      <OutlinedInput
        label="Description"
        value={description}
        onChange={value => onChange('description', value)}
      />
      <div className="grid items-start grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-4">
        <OutlinedInput
          label="Date*"
          value={startDate || ''}
          onChange={value => onChange('startDate', value)}
          type="date"
          id="date-picker"
        />
        <TimeInput
          label="Start time"
          onChange={value => onChange('startTime', value)}
          defaultValue={startTime}
        />
        <TimeInput
          label="End time"
          onChange={value => onChange('endTime', value)}
          defaultValue={endTime}
        />
      </div>
    </div>
  );
}
