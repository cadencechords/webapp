import classNames from 'classnames';
import type { ReactNode } from 'react';
import Icon from './Icon';

type DrawerProps = {
  open: boolean;
  onClose: () => void;
  /** The sheet's headline, and its accessible name. */
  title?: string;
  children: ReactNode;
};

// An M3 modal sheet over a scrim: a bottom sheet on phones (a drag handle,
// large top corners, at most 85% of the screen) and a 360dp side sheet from
// sm up. The headline sits beside a close icon button, and the content
// scrolls under it.
export default function Drawer({
  open,
  onClose,
  title,
  children,
}: DrawerProps) {
  return (
    <>
      <div
        className={`z-30 h-full fixed top-0 left-0 right-0 bottom-0 transition-default-effects
                    ${open ? 'visible bg-scrim/32' : 'hidden bg-scrim/0'}
                `}
        onClick={onClose}
      ></div>
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title}
        aria-hidden={!open}
        className={classNames(
          'z-30 fixed flex flex-col bg-surface-container-low text-on-surface shadow-(--md-sys-elevation-level1) transition-sheet',
          'inset-x-0 bottom-0 max-h-[85vh] rounded-t-extra-large',
          'sm:inset-x-auto sm:top-0 sm:right-0 sm:w-[360px] sm:max-w-[calc(100vw-56px)] sm:max-h-none sm:rounded-none sm:rounded-l-large',
          open
            ? 'translate-y-0 sm:translate-x-0'
            : 'translate-y-full sm:translate-y-0 sm:translate-x-full'
        )}
      >
        <div
          aria-hidden="true"
          className="self-center w-8 h-1 mt-4 mb-1 rounded-full bg-on-surface-variant/40 sm:hidden"
        />
        <div className="flex items-center gap-2 pl-6 pr-2 min-h-16 shrink-0">
          <h2 className="flex-1 min-w-0 truncate font-plain text-title-large text-on-surface">
            {title}
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex-center w-12 h-12 shrink-0 rounded-full text-on-surface-variant state-layer-flat focus-ring"
          >
            <Icon name="close" className="w-6 h-6" />
          </button>
        </div>
        <div className="px-2 pb-6 overflow-y-auto">{children}</div>
      </aside>
    </>
  );
}
