import classNames from 'classnames';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { LIST_ITEM_INTERACTIVE } from './lists/listItem';

// The pieces of a song's details column: a tile per detail (key, transposed
// key, BPM, meter, artist, last scheduled).

const INPUT_FOCUS =
  'focus-within:outline-2 focus-within:outline-solid focus-within:outline-primary focus-within:-outline-offset-2';

type DetailTileProps = {
  label: string;
  /** The value, or an input for it (with `input`). */
  children: ReactNode;
  /** Makes the whole tile a button, e.g. to open a picker. */
  onClick?: () => void;
  /** Makes the whole tile a link. */
  to?: string;
  /** An input in `children` gets the label (and the tile's hover). */
  input?: boolean;
  /** Buttons after the value, above the tile's own button. */
  actions?: ReactNode;
  /** A long value (an artist): smaller, and wraps instead of truncating. */
  wrap?: boolean;
};

/** A key fact on a surface-container tile: a label over a large value. */
export function DetailTile({
  label,
  children,
  onClick,
  to,
  input = false,
  actions,
  wrap = false,
}: DetailTileProps) {
  const tile =
    'relative flex flex-col justify-center min-h-[72px] min-w-0 px-4 py-2 rounded-large bg-surface-container font-plain';
  const body = (
    <>
      <span className="text-label-medium text-on-surface-variant">{label}</span>
      <span className="flex items-center justify-between gap-2 min-w-0">
        <span
          className={classNames(
            'min-w-0 text-on-surface',
            wrap
              ? 'break-words text-title-large'
              : 'truncate text-headline-small'
          )}
        >
          {children}
        </span>
        {actions && (
          <span className="relative flex shrink-0 -my-1 -mr-2">{actions}</span>
        )}
      </span>
    </>
  );

  if (input) {
    return (
      <label
        className={classNames(
          tile,
          'cursor-text state-layer-flat',
          INPUT_FOCUS
        )}
      >
        {body}
      </label>
    );
  }
  return (
    <div className={tile}>
      {to && (
        // Covers the tile, like the button below.
        <Link
          to={to}
          aria-label={label}
          className={classNames(
            'absolute inset-0 rounded-[inherit]',
            LIST_ITEM_INTERACTIVE
          )}
        />
      )}
      {onClick && (
        // Covers the tile, under the actions (positioned later in the tile).
        <button
          type="button"
          onClick={onClick}
          aria-label={`Change ${label.toLowerCase()}`}
          className={classNames(
            'absolute inset-0 rounded-[inherit]',
            LIST_ITEM_INTERACTIVE
          )}
        />
      )}
      {body}
    </div>
  );
}

/** A tile's input: the value, typed in place. */
export const TILE_INPUT =
  'w-full bg-transparent outline-none text-headline-small text-on-surface placeholder:text-title-medium placeholder:text-on-surface-variant caret-primary';

/** A `wrap` tile's input: grows to fit, so long text wraps like the static
    value. */
export const TILE_TEXTAREA =
  'block w-full resize-none bg-transparent outline-none [field-sizing:content] text-title-large text-on-surface placeholder:text-title-medium placeholder:text-on-surface-variant caret-primary';

/** A value that isn't set yet: quieter, and smaller on a tile. */
export function DetailPlaceholder({
  children,
  tile = false,
}: {
  children: ReactNode;
  tile?: boolean;
}) {
  return (
    <span
      className={classNames(
        'text-on-surface-variant',
        tile && 'text-title-medium'
      )}
    >
      {children}
    </span>
  );
}
