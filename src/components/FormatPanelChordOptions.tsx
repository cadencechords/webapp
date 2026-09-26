import React from 'react';
import useSongEditor from '../hooks/useSongEditor';
import type { SongFormat } from '../types';
import BoldItalicButtonGroup from './BoldItalicButtonGroup';
import ColorPicker from './ColorPicker';
import FormatOption from './FormatOption';
import FormatOptionLabel from './FormatOptionLabel';

export default function FormatPanelChordOptions() {
  const { song, updateFormat } = useSongEditor();
  const {
    bold_chords: isBold,
    italic_chords: isItalic,
    chord_color: chordColor,
    highlight_color: highlightColor,
  }: SongFormat = song?.format || {};

  function handleUpdateFormat<Field extends keyof SongFormat>(
    field: Field,
    value: SongFormat[Field]
  ) {
    updateFormat({ [field]: value });
  }

  return (
    <div>
      <div className="mb-4">
        <FormatOption>
          <BoldItalicButtonGroup
            isBold={isBold}
            isItalic={isItalic}
            onChange={handleUpdateFormat}
          />
        </FormatOption>
      </div>
      <FormatOption>
        <FormatOptionLabel>Highlight color</FormatOptionLabel>
        <div className="flex justify-end w-32 mr-2">
          <ColorPicker
            color={highlightColor}
            onChange={(newColor: string) =>
              handleUpdateFormat('highlight_color', newColor)
            }
          />
        </div>
      </FormatOption>
      <FormatOption>
        <FormatOptionLabel>Chord color</FormatOptionLabel>
        <div className="flex justify-end w-32 mr-2">
          <ColorPicker
            color={chordColor}
            onChange={(newColor: string) =>
              handleUpdateFormat('chord_color', newColor)
            }
          />
        </div>
      </FormatOption>
    </div>
  );
}
