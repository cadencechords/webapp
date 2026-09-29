import useSongEditor from '../hooks/useSongEditor';
import type { SongFormat } from '../types';
import BoldItalicButtonGroup from './BoldItalicButtonGroup';
import ColorPicker from './ColorPicker';
import FormatOption from './FormatOption';

// The chords' style (bold, italic) and colors, one row each.
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
    <div className="flex flex-col">
      <FormatOption label="Style">
        <BoldItalicButtonGroup
          isBold={isBold}
          isItalic={isItalic}
          onChange={handleUpdateFormat}
        />
      </FormatOption>
      <FormatOption label="Chord color">
        <ColorPicker
          large
          label="Chord color"
          color={chordColor}
          onChange={(newColor: string) =>
            handleUpdateFormat('chord_color', newColor)
          }
        />
      </FormatOption>
      <FormatOption label="Highlight color">
        <ColorPicker
          large
          label="Highlight color"
          color={highlightColor}
          onChange={(newColor: string) =>
            handleUpdateFormat('highlight_color', newColor)
          }
        />
      </FormatOption>
    </div>
  );
}
