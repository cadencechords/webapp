import { useCallback } from 'react';
import { useEventFormContext } from '../../contexts/EventFormProvider';
import type { EventForm } from '../../types';

export default function useEventForm() {
  const { form, setForm, isValid, populateForm } = useEventFormContext();

  function onChange<K extends keyof EventForm>(field: K, value: EventForm[K]) {
    setForm(previousForm => ({ ...previousForm, [field]: value }));
  }

  const clearForm = useCallback(() => {
    setForm({
      title: '',
      description: '',
      color: 'blue',
      memberships: [],
      remind_number_of_hours_before: 1,
    });
  }, [setForm]);

  return {
    form,
    onChange,
    isValid,
    clearForm,
    setForm: populateForm,
  };
}
