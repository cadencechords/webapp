import classNames from 'classnames';

// M3E connected button group, the replacement for segmented buttons: the
// buttons sit 2px apart, the group's outer corners are round and its inner
// corners are small, and a selected button goes fully round.

/** XS is 32px tall, S is 40px. */
export type ConnectedButtonSize = 'xs' | 's';

/** Classes for the element that holds the buttons. */
export const connectedGroupClasses = 'flex gap-0.5';

// Corner radii are spelled out in px (half the height for round), so the
// change between shapes animates and Tailwind can find the class names.
const SHAPES = {
  xs: {
    height: 'h-8',
    round: 'rounded-[16px]',
    first: 'rounded-l-[16px] rounded-r-[4px]',
    middle: 'rounded-[4px]',
    last: 'rounded-l-[4px] rounded-r-[16px]',
  },
  s: {
    height: 'h-10',
    round: 'rounded-[20px]',
    first: 'rounded-l-[20px] rounded-r-[8px]',
    middle: 'rounded-[8px]',
    last: 'rounded-l-[8px] rounded-r-[20px]',
  },
} satisfies Record<ConnectedButtonSize, Record<string, string>>;

/** Classes for the button at `index` of `count`. */
export function connectedButtonClasses({
  index,
  count,
  selected,
  size,
}: {
  index: number;
  count: number;
  selected: boolean;
  size: ConnectedButtonSize;
}) {
  const shape = SHAPES[size];
  let corners = shape.middle;
  if (selected || count === 1) corners = shape.round;
  else if (index === 0) corners = shape.first;
  else if (index === count - 1) corners = shape.last;

  return classNames(
    'flex-1 flex-center font-plain state-layer-flat focus-ring transition-fast-spatial',
    shape.height,
    corners,
    selected
      ? 'bg-primary text-on-primary'
      : 'bg-surface-container text-on-surface-variant'
  );
}
