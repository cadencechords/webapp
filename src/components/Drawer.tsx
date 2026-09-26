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
        className={`z-30 h-full fixed top-0 left-0 right-0 bottom-0 transition-all duration-200 ease-in-out
                    ${open ? 'visible bg-black/70' : 'hidden bg-black/0'}
                `}
        onClick={onClose}
      ></div>
      <aside
        className={`z-30 fixed top-0 bottom-0 right-0 h-full w-52 bg-white dark:bg-dark-gray-700 transform ${
          open ? 'translate-x-0' : 'translate-x-52'
        } transition-all`}
      >
        {children}
      </aside>
    </>
  );
}
