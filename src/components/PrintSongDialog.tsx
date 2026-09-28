import StyledDialog from './StyledDialog';
import { usePDF } from '@react-pdf/renderer';
import { toPdf } from '../utils/PdfUtils';
import { useCallback, useEffect, useState } from 'react';
import Button, { buttonClasses } from './Button';
import DialogActions from './DialogActions';
import ColorPicker from './ColorPicker';
import Toggle from './Toggle';
import OutlinedSelect from './inputs/OutlinedSelect';
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
  // Start the format over from the song whenever it changes (the key type is
  // kept). Print settings otherwise carry over between openings, so the
  // contents can't remount on open.
  const [previousInitialSong, setPreviousInitialSong] = useState(initialSong);
  if (initialSong !== previousInitialSong) {
    setPreviousInitialSong(initialSong);
    setSong(initialSong);
  }
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
          <div className="flex flex-col gap-5 pt-2">
            <OutlinedSelect
              id="font"
              label="Font"
              options={FONT_OPTIONS}
              selected={song.format.font}
              onChange={newValue => handleChange('font', newValue)}
              style={{ fontFamily: song.format.font }}
            />
            <OutlinedSelect
              label="Size"
              options={FONT_SIZES}
              selected={song.format.font_size}
              onChange={newValue => handleChange('font_size', newValue)}
            />
            <OutlinedSelect
              id="key-type"
              label="Key"
              options={keyOptions}
              selected={keyType}
              onChange={setKeyType}
            />
          </div>

          {/* M3 list rows: the label, then its control at the end. */}
          <div className="flex flex-col pt-3 mt-6 border-t border-outline-variant font-plain text-body-large text-on-surface">
            <div className="py-2">
              <Toggle
                label="Bold chords"
                spacing="between"
                enabled={song.format.bold_chords}
                onChange={newValue => handleChange('bold_chords', newValue)}
              />
            </div>
            <div className="py-2">
              <Toggle
                label="Italic chords"
                spacing="between"
                enabled={song.format.italic_chords}
                onChange={newValue => handleChange('italic_chords', newValue)}
              />
            </div>
            <div className="flex items-center justify-between py-2">
              Highlight color
              <ColorPicker
                large
                label="Highlight color"
                color={song.format.highlight_color}
                onChange={(newColor: string) =>
                  handleChange('highlight_color', newColor)
                }
              />
            </div>
            <div className="flex items-center justify-between py-2">
              Chord color
              <ColorPicker
                large
                label="Chord color"
                color={song.format.chord_color}
                onChange={(newColor: string) =>
                  handleChange('chord_color', newColor)
                }
              />
            </div>
          </div>
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
      <DialogActions>
        <Button
          variant="open"
          color="gray"
          size="sm"
          onClick={handleCloseDialog}
        >
          Cancel
        </Button>
        {/* A link styled as a text button: it downloads the rendered PDF. */}
        <a
          // The url is null until the PDF renders; React leaves out an href
          // of null, as it does undefined.
          href={instance.url as string | undefined}
          download={`${song.name}.pdf`}
          className={buttonClasses({
            variant: 'open',
            size: 'sm',
            className: 'flex-center',
          })}
        >
          Download
        </a>
      </DialogActions>
    </StyledDialog>
  );
}
