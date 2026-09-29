import Icon from './Icon';
import { SHAPE_PATHS } from './feedback/loadingShapes';

type BinderColorProps = {
  // A key of COLORS, 'none' (a crossed-out swatch) or 'white' (no fill).
  color?: string;
  onClick?: (color: string) => void;
  block?: boolean;
  size?: keyof typeof HEIGHT_SIZES | `${keyof typeof HEIGHT_SIZES}`;
  editable?: boolean;
};

export default function BinderColor({
  color = 'white',
  onClick,
  block,
  size = '4',
  editable = true,
}: BinderColorProps) {
  const handleClick = () => {
    if (onClick && editable) {
      onClick(color);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`${HEIGHT_SIZES[size]} relative flex-center shrink-0 outline-hidden focus:outline-hidden
				${block ? ' w-full py-3' : WIDTH_SIZES[size]}
				${onClick ? ' cursor-pointer' : ' cursor-default'}
			`}
    >
      <svg
        aria-hidden="true"
        viewBox={`0 0 ${PENTAGON.viewBox} ${PENTAGON.viewBox}`}
        className={`absolute inset-0 w-full h-full overflow-visible ${
          color === 'none'
            ? 'fill-none stroke-gray-300 dark:stroke-dark-gray-400'
            : (BINDER_FILL_CLASSES[color] ?? 'fill-none')
        }`}
      >
        {/* 'none' outlines the shape, 1px at any size. */}
        <path
          d={PENTAGON.d}
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {color === 'none' && (
        <Icon name="close" filled className="relative w-3 h-3 text-gray-600" />
      )}
    </div>
  );
}

// The loading indicator's pentagon, one of the M3 Expressive shapes
// (non-null: only the last, the oval, is generated).
const PENTAGON = SHAPE_PATHS[2]!;

// A touch bigger than the names say (14 and 18px), so the pentagon, which
// doesn't fill its box like a square, reads at the same weight.
const HEIGHT_SIZES = {
  3: 'h-3.5',
  4: 'h-4.5',
};

const WIDTH_SIZES = {
  3: 'w-3.5',
  4: 'w-4.5',
};

export const BINDER_COLOR_CLASSES: Record<string, string> = {
  red: 'bg-red-400',
  blue: 'bg-blue-400',
  green: 'bg-green-400',
  yellow: 'bg-yellow-400',
  indigo: 'bg-indigo-400',
  purple: 'bg-purple-400',
  pink: 'bg-pink-400',
  gray: 'bg-gray-400',
};

// The same colors for the swatch's SVG fill.
const BINDER_FILL_CLASSES: Record<string, string> = {
  red: 'fill-red-400',
  blue: 'fill-blue-400',
  green: 'fill-green-400',
  yellow: 'fill-yellow-400',
  indigo: 'fill-indigo-400',
  purple: 'fill-purple-400',
  pink: 'fill-pink-400',
  gray: 'fill-gray-400',
};
