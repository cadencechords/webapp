import { useCallback, useContext } from 'react';
import { EventFormContext } from '../../contexts/EventFormProvider';

export default function useEventForm() {
  const { form, setForm, isValid, populateForm } = useContext(EventFormContext);

  function onChange(field, value) {
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
