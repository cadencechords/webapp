import StyledListBox from './components/StyledListBox';
import { useState } from 'react';

type ReminderTimesListBoxProps = {
  /** Hours before the event; the first option (1 hour) when unset. */
  selectedTime?: number;
  onChange: (hoursBefore: number) => void;
};

export default function ReminderTimesListBox({
  selectedTime,
  onChange,
}: ReminderTimesListBoxProps) {
  const [reminderOptions] = useState(buildReminderOptions);

  function findTemplateByValue(value: number | undefined) {
    return reminderOptions.find(option => option.value === value)?.template;
  }

  const selectedTimeOption = {
    value: selectedTime || reminderOptions[0].value,
    template: findTemplateByValue(selectedTime) || reminderOptions[0].template,
  };

  return (
    <StyledListBox
      options={reminderOptions}
      selectedOption={selectedTimeOption}
      onChange={onChange}
    />
  );
}

function buildReminderOptions() {
  return [
    { value: 1, template: '1 hour before' },
    { value: 2, template: '2 hours before' },
    { value: 6, template: '6 hours before' },
    { value: 24, template: '1 day before' },
    { value: 72, template: '3 days before' },
    { value: 168, template: '1 week before' },
  ];
}
