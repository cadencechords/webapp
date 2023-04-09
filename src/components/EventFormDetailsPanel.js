import React from 'react';
import useEventForm from '../hooks/forms/useEventForm';
import Label from './Label';
import OutlinedInput from './inputs/OutlinedInput';
import TimeInput from './inputs/TimeInput';
import EventColorOptions from './EventColorOptions';

export default function EventFormDetailsPanel() {
  const { form, onChange } = useEventForm();
  const { title, description, color, startDate, startTime, endTime } = form;
  return (
    <div>
      <Label>Title*</Label>
      <OutlinedInput
        value={title}
        onChange={value => onChange('title', value)}
        placeholder="Title"
        className="mb-4"
      />
      <Label>Description</Label>
      <OutlinedInput
        value={description}
        onChange={value => onChange('description', value)}
        placeholder="Description"
        className="mb-4"
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="w-full">
          <Label>Date*</Label>
          <OutlinedInput
            value={startDate || ''}
            onChange={value => onChange('startDate', value)}
            placeholder="Date"
            className="h-10"
            type="date"
            id="date-picker"
          />
        </div>

        <div className="flex mb-8">
          <div className="w-full mr-4">
            <Label>Time</Label>
            <TimeInput
              onChange={value => onChange('startTime', value)}
              defaultValue={startTime}
            />
          </div>
          <div className="w-full">
            <Label>End time</Label>
            <TimeInput
              className="w-full"
              onChange={value => onChange('endTime', value)}
              defaultValue={endTime}
            />
          </div>
        </div>
      </div>

      <EventColorOptions
        onClick={value => onChange('color', value)}
        selectedColor={color}
      />
    </div>
  );
}
