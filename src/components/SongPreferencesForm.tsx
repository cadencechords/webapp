import React, { useState } from 'react';
import Checkbox from './Checkbox';
import FormatOptionLabel from './FormatOptionLabel';

export default function SongPreferencesForm({ songPreferences, onChange }) {
  const [form, setForm] = useState(songPreferences);
  const { hide_chords } = form;

  function handleChange(field, value) {
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
