import OutlinedSelect from './components/inputs/OutlinedSelect';

type ReminderTimesListBoxProps = {
  /** Hours before the event; the first option (1 hour) when unset. */
  selectedTime?: number;
  onChange: (hoursBefore: number) => void;
};

const REMINDER_OPTIONS = [
  { value: 1, display: '1 hour before' },
  { value: 2, display: '2 hours before' },
  { value: 6, display: '6 hours before' },
  { value: 24, display: '1 day before' },
  { value: 72, display: '3 days before' },
  { value: 168, display: '1 week before' },
];

// When an event's reminder goes out, as an M3 outlined dropdown field.
export default function ReminderTimesListBox({
  selectedTime,
  onChange,
}: ReminderTimesListBoxProps) {
  const selected = REMINDER_OPTIONS.some(({ value }) => value === selectedTime)
    ? selectedTime
    : REMINDER_OPTIONS[0]!.value;

  return (
    <OutlinedSelect
      label="Send reminder"
      options={REMINDER_OPTIONS}
      selected={selected}
      onChange={value => onChange(Number(value))}
    />
  );
}
