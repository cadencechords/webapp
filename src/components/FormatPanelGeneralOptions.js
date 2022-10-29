import React from 'react';
import useSongEditor from '../hooks/useSongEditor';
import FormatOption from './FormatOption';
import FormatOptionLabel from './FormatOptionLabel';
import Select from './Select';

export default function FormatPanelGeneralOptions() {
  const { song, updateFormat } = useSongEditor();
  const { font_size: size, font } = song?.format || {};

  function handleUpdateFormat(field, value) {
    updateFormat({ [field]: value });
  }

  return (
    <div>
      <FormatOption>
        <FormatOptionLabel>Font</FormatOptionLabel>
        <div className="w-44">
          <Select
            options={FONT_OPTIONS}
            selected={font}
            onChange={newFont => handleUpdateFormat('font', newFont)}
            className="h-6"
          />
        </div>
      </FormatOption>
      <FormatOption>
        <FormatOptionLabel>Size</FormatOptionLabel>
        <div className="w-44">
          <Select
            options={FONT_SIZES}
            selected={size}
            className="h-6"
            onChange={newSize => handleUpdateFormat('font_size', newSize)}
          />
        </div>
      </FormatOption>
    </div>
  );
}

export const FONT_OPTIONS = [
  { value: 'Roboto Mono', display: 'Roboto Mono' },
  { value: 'Open Sans', display: 'Open Sans' },
];

export const FONT_SIZES = [
  { value: '14', display: '14' },
  { value: '15', display: '15' },
  { value: '16', display: '16' },
  { value: '17', display: '17' },
  { value: '18', display: '18' },
  { value: '19', display: '19' },
  { value: '20', display: '20' },
  { value: '21', display: '21' },
  { value: '22', display: '22' },
  { value: '24', display: '24' },
  { value: '26', display: '26' },
  { value: '28', display: '28' },
  { value: '30', display: '30' },
];
