import type { SVGAttributes } from 'react';
import { ICONS } from './icons/registry';

// Looked up by any name: an unknown one is undefined, and Icon renders null.
const ICONS_BY_NAME: Partial<
  Record<string, (typeof ICONS)[keyof typeof ICONS]>
> = ICONS;

// A Material Symbols Rounded icon. Size and color come from CSS, like the
// Heroicons it replaces: <Icon name="delete" className="w-5 h-5 text-gray-600" />.
// `filled` uses the filled variant; `size` (px) sets width and height inline.
// Icons are decorative (aria-hidden); give the control an accessible name.
type IconProps = Omit<SVGAttributes<SVGSVGElement>, 'name'> & {
  /** Material Symbols name, e.g. "delete" */
  name: string;
  filled?: boolean;
  /** Width and height in px. */
  size?: number;
};

export default function Icon({
  name,
  filled = false,
  size,
  className = '',
  style,
  ...props
}: IconProps) {
  const Svg = ICONS_BY_NAME[filled ? `${name}-fill` : name];
  if (!Svg) {
    if (import.meta.env.DEV)
      console.warn(
        `Icon "${name}"${filled ? ' (filled)' : ''} isn't in src/components/icons/registry.js`
      );
    return null;
  }
  return (
    <Svg
      aria-hidden="true"
      focusable="false"
      className={className}
      style={size ? { width: size, height: size, ...style } : style}
      {...props}
    />
  );
}
