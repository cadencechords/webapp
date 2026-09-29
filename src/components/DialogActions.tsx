import type { ReactNode } from 'react';

// M3 dialog actions: buttons at the end, 8dp apart. 24px above them, and
// -mb-2 takes the dialog's 32px under them down to 24px, so the footer sits
// evenly between the body and the dialog's edge.
export default function DialogActions({ children }: { children: ReactNode }) {
  return <div className="flex justify-end gap-2 mt-6 -mb-2">{children}</div>;
}
