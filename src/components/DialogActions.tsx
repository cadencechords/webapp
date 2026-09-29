import { useContext, type MouseEventHandler, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import Button from './Button';
import { DialogHeaderContext } from './DialogHeaderContext';

type DialogActionsProps = {
  /** Buttons as they are, at the end. */
  children?: ReactNode;
  /** The dialog's main action (Save, Add). In a full-screen dialog on a phone
      it moves to the header, next to the close button that replaces Cancel. */
  primary?: ReactNode;
  /** With `primary`: what Cancel does. */
  onCancel?: MouseEventHandler<HTMLButtonElement>;
  /** With `primary`: an action for the start, apart from Cancel and the
      primary one, e.g. Delete. It stays at the bottom. */
  start?: ReactNode;
};

const CLASSES = 'flex justify-end gap-2 mt-6 -mb-2';

// M3 dialog actions: buttons at the end, 8dp apart. 24px above them, and
// -mb-2 takes the dialog's 32px under them down to 24px, so the footer sits
// evenly between the body and the dialog's edge.
export default function DialogActions({
  children,
  primary,
  onCancel,
  start,
}: DialogActionsProps) {
  const header = useContext(DialogHeaderContext);

  if (primary === undefined) return <div className={CLASSES}>{children}</div>;

  if (header.mobile) {
    return (
      <>
        {start && <div className={CLASSES}>{start}</div>}
        {header.slot && createPortal(primary, header.slot)}
      </>
    );
  }

  return (
    <div className={CLASSES}>
      {start}
      <Button variant="open" color="gray" size="sm" onClick={onCancel}>
        Cancel
      </Button>
      {primary}
    </div>
  );
}
