import { useState } from 'react';

export default function useSongForm() {
  const [form, setForm] = useState({ name: '' });

  function onChange(field, value) {
    setForm(previousForm => ({ ...previousForm, [field]: value }));
  }

  function checkIfValid() {
    return !!form.name;
  }

  function clearForm() {
    setForm({ name: '' });
  }

  return { form, onChange, isValid: checkIfValid(), clearForm };
}
