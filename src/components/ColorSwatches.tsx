import classNames from 'classnames';
import Icon from './Icon';
import { BINDER_COLOR_CLASSES } from './BinderColor';
import { COLORS } from '../utils/BinderUtils';

type ColorSwatchesProps = {
  /** A key of `COLORS`, `'none'`, or unset (none). */
  color?: string;
  onChange: (color: string) => void;
};

// A folder's color as a row of 40dp round swatches that wraps, one per
// color, as a radio group. The picked one shows a check and a ring 2px
// outside it; "none" is an outlined swatch.
export default function ColorSwatches({ color, onChange }: ColorSwatchesProps) {
  const picked = color || 'none';

  return (
    <div role="radiogroup" aria-label="Color" className="flex flex-wrap gap-3">
      {COLORS.map(swatch => {
        const isPicked = swatch === picked;
        const isNone = swatch === 'none';
        return (
          <button
            key={swatch}
            type="button"
            role="radio"
            aria-checked={isPicked}
            aria-label={isNone ? 'No color' : swatch}
            onClick={() => onChange(swatch)}
            className={classNames(
              'flex-center w-10 h-10 rounded-full focus-ring transition-fast-effects',
              isNone
                ? 'border-2 border-outline text-on-surface-variant'
                : `${BINDER_COLOR_CLASSES[swatch]} text-white`,
              isPicked &&
                'outline-2 outline-offset-2 outline-solid outline-on-surface',
              !isPicked && 'hover:scale-110'
            )}
          >
            {isPicked ? (
              <Icon name="check" className="w-5 h-5" />
            ) : (
              isNone && <Icon name="close" className="w-5 h-5" />
            )}
          </button>
        );
      })}
    </div>
  );
}
