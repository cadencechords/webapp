import React from 'react';
import useSongEditor from '../hooks/useSongEditor';
import FormatOption from './FormatOption';
import FormatOptionLabel from './FormatOptionLabel';
import { FONT_OPTIONS, FONT_SIZES } from './FormatPanelGeneralOptions';
import Select from './Select';

export default function FormatBottomSheetGeneralOptions() {
  const { song, updateFormat } = useSongEditor();
  const { font_size: size, font } = song?.format || {};

  function handleUpdateFormat(field, value) {
    updateFormat({ [field]: value });
  }
  return (
    <div className="p-4">
      <div className="mb-4">
        <FormatOption>
          <FormatOptionLabel>Font</FormatOptionLabel>
          <div className="w-52">
            <Select
              options={FONT_OPTIONS}
              selected={font}
              onChange={newFont => handleUpdateFormat('font', newFont)}
              className="h-8"
              style={{ fontFamily: font }}
            />
          </div>
        </FormatOption>
      </div>
      <FormatOption>
        <FormatOptionLabel>Size</FormatOptionLabel>
        <div className="w-52">
          <Select
            options={FONT_SIZES}
            selected={size}
            className="h-8"
            onChange={newSize => handleUpdateFormat('font_size', newSize)}
          />
        </div>
      </FormatOption>
    </div>
  );
}
