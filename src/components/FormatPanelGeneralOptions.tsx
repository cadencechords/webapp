import useSongEditor from '../hooks/useSongEditor';
import type { SongFormat } from '../types';
import FormatOption from './FormatOption';
import Icon from './Icon';
import MenuSelect from './MenuSelect';

// The song's font, as a menu showing each font in itself, and its size, as a
// stepper through FONT_SIZES.
export default function FormatPanelGeneralOptions() {
  const { song, updateFormat } = useSongEditor();
  const { font_size: size, font }: SongFormat = song?.format || {};
  const sizeIndex = FONT_SIZES.findIndex(option => option.value === `${size}`);

  function stepSize(by: number) {
    const next =
      FONT_SIZES[
        Math.min(
          FONT_SIZES.length - 1,
          Math.max(0, (sizeIndex < 0 ? DEFAULT_SIZE_INDEX : sizeIndex) + by)
        )
      ];
    updateFormat({ font_size: next.value });
  }

  return (
    <div className="flex flex-col">
      <FormatOption label="Font">
        <MenuSelect
          options={FONT_OPTIONS.map(option => ({
            value: option.value,
            display: (
              <span style={{ fontFamily: option.value }}>{option.display}</span>
            ),
          }))}
          selected={font}
          onChange={newFont => updateFormat({ font: newFont })}
        />
      </FormatOption>
      <FormatOption label="Size">
        <div className="flex items-center gap-1">
          <StepButton
            label="Smaller"
            icon="remove"
            disabled={sizeIndex === 0}
            onClick={() => stepSize(-1)}
          />
          <span className="w-8 text-center text-title-medium tabular-nums">
            {size ?? '–'}
          </span>
          <StepButton
            label="Larger"
            icon="add"
            disabled={sizeIndex === FONT_SIZES.length - 1}
            onClick={() => stepSize(1)}
          />
        </div>
      </FormatOption>
    </div>
  );
}

/** A 40dp tonal icon button on the neutral container. */
function StepButton({
  label,
  icon,
  disabled,
  onClick,
}: {
  label: string;
  icon: 'add' | 'remove';
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex-center w-10 h-10 rounded-[20px] [--shape-morph-to:8px] bg-surface-container-highest text-on-surface-variant state-layer-flat focus-ring shape-morph disabled:opacity-38 disabled:cursor-default"
    >
      <Icon name={icon} className="w-5 h-5" />
    </button>
  );
}

export const FONT_OPTIONS = [
  { value: 'Roboto Mono', display: 'Roboto Mono' },
  { value: 'Open Sans', display: 'Open Sans' },
  { value: 'Liberation Sans', display: 'Liberation Sans' },
];

export const FONT_SIZES = [
  { value: '10', display: '10' },
  { value: '11', display: '11' },
  { value: '12', display: '12' },
  { value: '13', display: '13' },
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

/** Where the stepper starts for a song without a size: 16. */
const DEFAULT_SIZE_INDEX = FONT_SIZES.findIndex(
  option => option.value === '16'
);
