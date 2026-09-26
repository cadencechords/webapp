import { useState } from 'react';

/** The create-song form. */
export type SongForm = { name: string };

export default function useSongForm() {
  const [form, setForm] = useState<SongForm>({ name: '' });

  function onChange<Field extends keyof SongForm>(
    field: Field,
    value: SongForm[Field]
  ) {
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
