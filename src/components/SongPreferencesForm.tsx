import React, { useState } from 'react';
import Checkbox from './Checkbox';
import FormatOptionLabel from './FormatOptionLabel';
import type { FormatPreferences } from '../types';

type SongPreferencesFormProps = {
  songPreferences: FormatPreferences;
  onChange: (field: keyof FormatPreferences, value: boolean) => void;
};

export default function SongPreferencesForm({
  songPreferences,
  onChange,
}: SongPreferencesFormProps) {
  const [form, setForm] = useState(songPreferences);
  const { hide_chords } = form;

  function handleChange(field: keyof FormatPreferences, value: boolean) {
    setForm({ ...form, [field]: value });

    onChange(field, value);
  }

  return (
    <div>
      <div className="flex items-center justify-start gap-4">
        <Checkbox
          checked={!hide_chords}
          id="hide-chords"
          onChange={newValue => handleChange('hide_chords', !newValue)}
        />
        <FormatOptionLabel htmlFor="hide-chords">
          Show chords in songs
        </FormatOptionLabel>
      </div>
    </div>
  );
}
