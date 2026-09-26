import StyledDialog from './StyledDialog';
import { usePDF } from '@react-pdf/renderer';
import { toPdf } from '../utils/PdfUtils';
import { useCallback, useEffect, useState } from 'react';
import Button from './Button';
import Checkbox from './Checkbox';
import ColorPicker from './ColorPicker';
import Select from './Select';
import FormatOption from './FormatOption';
import FormatOptionLabel from './FormatOptionLabel';
import { FONT_OPTIONS, FONT_SIZES } from './FormatPanelGeneralOptions';
import { determineCapoNumber } from '../utils/capo';
import type { Song, SongFormat } from '../types';

type PrintSongDialogProps = {
  song: Song;
  open: boolean;
  onCloseDialog: () => void;
};

export default function PrintSongDialog({
  song: initialSong,
  open,
  onCloseDialog,
}: PrintSongDialogProps) {
  const [keyType, setKeyType] = useState<string>(determineInitialKeyType);
  const [song, setSong] = useState({ ...initialSong });
  const keyOptions = getKeyOptions();
  const showChords = keyType !== 'none';

  function determineInitialKeyType() {
    if (initialSong.capo?.capo_key) {
      return 'capo';
    }

    if (initialSong.transposed_key) {
      return 'transposed';
    }

    return 'original';
  }

  const getSongWithKeyType = useCallback(() => {
    const songWithKeyType = { ...song };

    delete songWithKeyType.capo;
    delete songWithKeyType.show_transposed;
    if (keyType === 'transposed' && song.transposed_key) {
      songWithKeyType.show_transposed = true;
    }

    if (keyType === 'capo' && song.capo?.capo_key) {
      songWithKeyType.capo = song.capo;
    }

    return songWithKeyType;
  }, [song, keyType]);

  const [instance, updateInstance] = usePDF({
    document: toPdf(getSongWithKeyType(), showChords),
  });

  useEffect(() => {
    // `updateInstance` takes no arguments: it re-renders the document last
    // passed to `usePDF` above, which is built from the same values.
    updateInstance();
  }, [song, showChords, updateInstance, getSongWithKeyType]);

  const handleCloseDialog = () => {
    onCloseDialog();
  };

  useEffect(() => {
    setSong(initialSong);
  }, [initialSong]);

  function getKeyOptions() {
    const options = [];

    if (song.original_key)
      options.push({
        value: 'original',
        display: `Original (${song.original_key})`,
      });
    if (song.transposed_key)
      options.push({
        value: 'transposed',
        display: `Transposed (${song.transposed_key})`,
      });
    if (song.capo?.capo_key) {
      const currentKey = song.transposed_key || song.original_key;
      options.push({
        value: 'capo',
        // A capo is picked for the song's current key (the capo sheet lists
        // capos for it), so a song with a capo_key has a key.
        display: `Capo ${determineCapoNumber(
          currentKey as string,
          song.capo.capo_key
        )} (${song.capo.capo_key})`,
      });
    }

    if (options.length !== 0)
      options.push({ value: 'none', display: 'Hide chords' });

    return options;
  }

  function handleChange<Field extends keyof SongFormat>(
    field: Field,
    value: SongFormat[Field]
  ) {
    setSong({ ...song, format: { ...song.format, [field]: value } });
  }

  return (
    <StyledDialog
      open={open}
      onCloseDialog={handleCloseDialog}
      size="5xl"
      title="Printing"
    >
      <div className="grid grid-cols-8 gap-8 mb-4">
        <div className="col-span-8 md:col-span-2">
          <FormatOption>
            <FormatOptionLabel htmlFor="font">Font</FormatOptionLabel>
            <div className="w-40">
              <Select
                id="font"
                options={FONT_OPTIONS}
                selected={song.format.font}
                onChange={newValue => handleChange('font', newValue)}
                className="h-6"
                style={{ fontFamily: song.format.font }}
              />
            </div>
          </FormatOption>
          <FormatOption>
            <FormatOptionLabel>Size</FormatOptionLabel>
            <div className="w-40">
              <Select
                options={FONT_SIZES}
                selected={song.format.font_size}
                className="h-6"
                onChange={newValue => handleChange('font_size', newValue)}
              />
            </div>
          </FormatOption>
          <FormatOption>
            <FormatOptionLabel htmlFor="key-type">Key</FormatOptionLabel>
            <div className="w-40">
              <Select
                id="key-type"
                options={keyOptions}
                selected={keyType}
                onChange={setKeyType}
                className="h-6"
              />
            </div>
          </FormatOption>

          <div className="pt-4 mt-8 border-t dark:border-dark-gray-600">
            <FormatOption>
              <FormatOptionLabel>Bold chords</FormatOptionLabel>
              <Checkbox
                checked={song.format.bold_chords}
                onChange={newValue => handleChange('bold_chords', newValue)}
              />
            </FormatOption>
          </div>
          <FormatOption>
            <FormatOptionLabel>Italic chords</FormatOptionLabel>
            <Checkbox
              checked={song.format.italic_chords}
              onChange={newValue => handleChange('italic_chords', newValue)}
            />
          </FormatOption>
          <FormatOption>
            <FormatOptionLabel>Highlight color</FormatOptionLabel>
            <ColorPicker
              color={song.format.highlight_color}
              onChange={(newColor: string) =>
                handleChange('highlight_color', newColor)
              }
            />
          </FormatOption>
          <FormatOption>
            <FormatOptionLabel>Chord color</FormatOptionLabel>
            <ColorPicker
              color={song.format.chord_color}
              onChange={(newColor: string) =>
                handleChange('chord_color', newColor)
              }
            />
          </FormatOption>
          <a
            // The url is null until the PDF renders; React leaves out an href
            // of null, as it does undefined.
            href={instance.url as string | undefined}
            download={`${song.name}.pdf`}
          >
            <Button full className="mt-4">
              Download
            </Button>
          </a>
        </div>
        <div className="col-span-8 md:col-span-6">
          <embed
            key={`${instance.url}`}
            src={`${instance.url}#scrollbar=0`}
            width="100%"
            height="600px"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button variant="open" color="blue" onClick={handleCloseDialog}>
          Cancel
        </Button>
      </div>
    </StyledDialog>
  );
}
