import { useState } from 'react';
import Toggle from './Toggle';
import { SettingsRowText } from './settings/SettingsRow';
import { LIST_ITEM_INTERACTIVE, LIST_ITEM_TWO_LINE } from './lists/listItem';
import type { FormatPreferences } from '../types';

type SongPreferencesFormProps = {
  songPreferences: FormatPreferences;
  onChange: (field: keyof FormatPreferences, value: boolean) => void;
};

// How songs look when they open, as a segmented list of switch rows: the
// whole row toggles its switch.
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
    <div className="list-segmented">
      <Toggle
        enabled={!hide_chords}
        onChange={shown => handleChange('hide_chords', !shown)}
        className={`${LIST_ITEM_TWO_LINE} ${LIST_ITEM_INTERACTIVE}`}
        labelClassName="flex items-center flex-1 min-w-0 gap-4 cursor-pointer"
        label={
          <SettingsRowText
            icon="music_note"
            title="Show chords"
            description="Chords above the lyrics when you open a song"
          />
        }
      />
    </div>
  );
}
