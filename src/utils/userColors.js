// Render-time mapping for colors users pick (binders, notes, events). The
// stored names never change; this only decides how they look. Tokens come
// from scripts/color-tokens.mts (USER_COLORS). Class names are spelled out so
// Tailwind can find them.

const CLASSES = {
  red: {
    color: 'bg-user-red',
    onColor: 'text-on-user-red',
    container: 'bg-user-red-container',
    onContainer: 'text-on-user-red-container',
  },
  blue: {
    color: 'bg-user-blue',
    onColor: 'text-on-user-blue',
    container: 'bg-user-blue-container',
    onContainer: 'text-on-user-blue-container',
  },
  green: {
    color: 'bg-user-green',
    onColor: 'text-on-user-green',
    container: 'bg-user-green-container',
    onContainer: 'text-on-user-green-container',
  },
  yellow: {
    color: 'bg-user-yellow',
    onColor: 'text-on-user-yellow',
    container: 'bg-user-yellow-container',
    onContainer: 'text-on-user-yellow-container',
  },
  pink: {
    color: 'bg-user-pink',
    onColor: 'text-on-user-pink',
    container: 'bg-user-pink-container',
    onContainer: 'text-on-user-pink-container',
  },
  purple: {
    color: 'bg-user-purple',
    onColor: 'text-on-user-purple',
    container: 'bg-user-purple-container',
    onContainer: 'text-on-user-purple-container',
  },
  indigo: {
    color: 'bg-user-indigo',
    onColor: 'text-on-user-indigo',
    container: 'bg-user-indigo-container',
    onContainer: 'text-on-user-indigo-container',
  },
  gray: {
    color: 'bg-user-gray',
    onColor: 'text-on-user-gray',
    container: 'bg-user-gray-container',
    onContainer: 'text-on-user-gray-container',
  },
  black: {
    color: 'bg-user-black',
    onColor: 'text-on-user-black',
    container: 'bg-user-black-container',
    onContainer: 'text-on-user-black-container',
  },
  // Binders with no color, and anything unexpected
  none: {
    color: 'bg-outline-variant',
    onColor: 'text-on-surface',
    container: 'bg-surface-container-highest',
    onContainer: 'text-on-surface-variant',
  },
};

export const USER_COLOR_NAMES = [
  'red',
  'blue',
  'green',
  'yellow',
  'pink',
  'purple',
  'indigo',
  'gray',
  'black',
];

// { color, onColor, container, onContainer } Tailwind classes for a stored color.
export function userColorClasses(name) {
  return CLASSES[name] ?? CLASSES.none;
}
