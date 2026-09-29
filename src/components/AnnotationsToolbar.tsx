import classNames from 'classnames';
import useAnnotationsToolbar from '../hooks/useAnnotationsToolbar';
import usePerformanceMode from '../hooks/usePerformanceMode';
import StrokeWidthPopover from './StrokeWidthPopover';
import * as colorUtils from '../utils/color.utils';
import ColorPickerPopover from './ColorPickerPopover';
import Icon from './Icon';
import type { OutlinedIconName } from './icons/registry';
import type { AnnotationUtensil } from '../contexts/AnnotationsToolbarProvider';

const UTENSILS: {
  name: AnnotationUtensil;
  label: string;
  icon: OutlinedIconName;
}[] = [
  { name: 'scroll', label: 'Scroll', icon: 'swipe_vertical' },
  { name: 'highlighter', label: 'Highlighter', icon: 'ink_highlighter' },
  { name: 'pen', label: 'Pen', icon: 'stylus' },
  { name: 'eraser', label: 'Eraser', icon: 'ink_eraser' },
];

// A 48dp toggle icon button: round, and a squarer secondary-container
// shape once it's the utensil in hand. Round is a 24px radius, not
// rounded-full: that's an infinite radius, which doesn't animate to 14px (it
// flashes square on the way).
function utensilClasses(selected: boolean) {
  return classNames(
    'flex-center w-12 h-12 shrink-0 rounded-[24px] [--shape-morph-to:14px] state-layer-flat focus-ring shape-morph',
    selected
      ? 'bg-secondary-container text-on-secondary-container'
      : 'text-on-surface-variant'
  );
}

const SWATCH_BUTTON =
  'flex-center w-12 h-12 rounded-full state-layer-flat focus-ring';

// While annotating, an M3 Expressive floating toolbar at the bottom: the
// utensils as toggle icon buttons, then a swatch for the color (and the
// highlighter's or pen's stroke width).
export default function AnnotationsToolbar() {
  const { isAnnotating } = usePerformanceMode();
  const { color, utensil, setUtensil, setStrokeWidth, setColor } =
    useAnnotationsToolbar();

  function handleClick(name: AnnotationUtensil) {
    if (name === utensil) return;
    if (name === 'highlighter') {
      setColor(colorUtils.setAlpha(color, 0.5));
      setStrokeWidth(16);
    } else if (name === 'pen') {
      setColor(colorUtils.setAlpha(color, 1));
      setStrokeWidth(2);
    }
    setUtensil(name);
  }

  if (!isAnnotating) return null;

  const hasWidths = utensil === 'highlighter' || utensil === 'pen';
  const utensilLabel = UTENSILS.find(({ name }) => name === utensil)?.label;
  const swatch = (label: string) => (
    <>
      <span
        className="block w-8 h-8 border-2 rounded-full border-outline-variant"
        style={{ backgroundColor: color }}
      />
      <span className="sr-only">{label}</span>
    </>
  );

  return (
    <div className="fixed inset-x-0 z-30 flex justify-center px-4 pointer-events-none bottom-[max(1.25rem,env(safe-area-inset-bottom))]">
      <div
        role="toolbar"
        aria-label="Annotation tools"
        className="flex items-center gap-1 p-2 rounded-full pointer-events-auto bg-surface-container-high text-on-surface shadow-(--md-sys-elevation-level3)"
      >
        {UTENSILS.map(({ name, label, icon }) => (
          // Always this same button, so picking a utensil animates its shape
          // and color rather than swapping the element.
          <button
            key={name}
            type="button"
            aria-pressed={name === utensil}
            onClick={() => handleClick(name)}
            className={utensilClasses(name === utensil)}
          >
            <Icon name={icon} className="w-6 h-6" />
            <span className="sr-only">{label}</span>
          </button>
        ))}
        <div aria-hidden="true" className="w-px h-8 mx-1 bg-outline-variant" />
        {/* The swatch opens the color, and the stroke widths too while the
            highlighter or pen is in hand. */}
        {hasWidths ? (
          <StrokeWidthPopover
            buttonClassName={SWATCH_BUTTON}
            button={swatch(`${utensilLabel} color and width`)}
          />
        ) : (
          <ColorPickerPopover
            buttonClassName={SWATCH_BUTTON}
            button={swatch('Color')}
          />
        )}
      </div>
    </div>
  );
}
