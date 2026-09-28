import classNames from 'classnames';
import type { ReactNode } from 'react';
import useHideOnScroll from '../hooks/useHideOnScroll';

type PresenterTopAppBarProps = {
  /** The navigation icon button, or Cancel in the contextual bar. */
  leading?: ReactNode;
  title?: ReactNode;
  /** A line under the title, e.g. the set's name. */
  subtitle?: ReactNode;
  /** Icon buttons (or Save) at the end. */
  actions?: ReactNode;
  /** The contextual bar while annotating: secondary-container, always
      shown. */
  contextual?: boolean;
};

// An M3 small top app bar for the presenters, stuck to the top: on the
// surface, and surface-container once the song scrolls under it. It slides
// away while the song scrolls down and comes back on scrolling up.
export default function PresenterTopAppBar({
  leading,
  title,
  subtitle,
  actions,
  contextual = false,
}: PresenterTopAppBarProps) {
  const { hidden, scrolled } = useHideOnScroll(!contextual);

  return (
    <nav
      data-hidden={hidden || undefined}
      className={classNames(
        // Slides on the default-spatial curve; the color follows along.
        'sticky top-0 z-30 h-16 px-1 transition-[translate,background-color,color] duration-(--md-sys-motion-duration-default-spatial) ease-(--md-sys-motion-easing-default-spatial)',
        hidden && '-translate-y-full',
        contextual
          ? 'bg-secondary-container text-on-secondary-container'
          : scrolled
            ? 'bg-surface-container text-on-surface'
            : 'bg-surface text-on-surface'
      )}
    >
      <div className="flex items-center h-full max-w-4xl gap-1 mx-auto">
        {leading}
        <div className="flex-1 min-w-0 px-2">
          <h1 className="truncate font-plain text-title-large">{title}</h1>
          {subtitle && (
            <div
              className={classNames(
                'truncate font-plain text-body-small',
                contextual
                  ? 'text-on-secondary-container'
                  : 'text-on-surface-variant'
              )}
            >
              {subtitle}
            </div>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-1 shrink-0">{actions}</div>
        )}
      </div>
    </nav>
  );
}

/** A standard 48dp icon button's classes, for a link or button in the bar. */
export const PRESENTER_ICON_BUTTON =
  'flex-center w-12 h-12 shrink-0 rounded-full text-on-surface-variant state-layer-flat focus-ring';
