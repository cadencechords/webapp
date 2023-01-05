import StyledListBox from './components/StyledListBox';
import { useState } from 'react';

export default function ReminderTimesListBox({ selectedTime, onChange }) {
  const [reminderOptions] = useState(buildReminderOptions);

  function findTemplateByValue(value) {
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
