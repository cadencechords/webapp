import type { ReactNode } from 'react';

type DrawerProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

export default function Drawer({ open, onClose, children }: DrawerProps) {
  return (
    <>
      <div
        className={`z-30 h-full fixed top-0 left-0 right-0 bottom-0 transition-default-effects
                    ${open ? 'visible bg-scrim/32' : 'hidden bg-scrim/0'}
                `}
        onClick={onClose}
      ></div>
      <aside
        // M3 modal side sheet
        className={`z-30 fixed top-0 bottom-0 right-0 h-full w-52 bg-surface-container-low text-on-surface rounded-l-large shadow-(--md-sys-elevation-level1) ${
          open ? 'translate-x-0' : 'translate-x-56'
        } transition-sheet`}
      >
        {children}
      </aside>
    </>
  );
}
