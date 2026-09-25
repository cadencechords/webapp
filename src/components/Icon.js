import { ICONS } from './icons/registry';

// A Material Symbols Rounded icon. Size and color come from CSS, like the
// Heroicons it replaces: <Icon name="delete" className="w-5 h-5 text-gray-600" />.
// `filled` uses the filled variant; `size` (px) sets width and height inline.
// Icons are decorative (aria-hidden); give the control an accessible name.
export default function Icon({ name, filled = false, size, className = '', style, ...props }) {
  const Svg = ICONS[filled ? `${name}-fill` : name];
  if (!Svg) {
    if (import.meta.env.DEV) console.warn(`Icon "${name}"${filled ? ' (filled)' : ''} isn't in src/components/icons/registry.js`);
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
