import { useState } from 'react';
import Button from './Button';
import Icon from './Icon';

type UnsavedChangesBarProps = {
  /** The pending edits. Each edit is a new object, which brings a dismissed
      bar back. */
  changes: object;
  isSaving: boolean;
  onSave: () => void;
};

// A detail page's pending edits, above its title: a tonal banner on
// primary-container saying there are unsaved changes, with a filled Save
// button and a dismiss button at its end. Dismissing only hides the bar: the
// edits stay pending, and it shows again with the next edit. It
// sticks to the top while the page scrolls, so it stays in view while editing
// fields further down. Above the song's chords, which are positioned at z-10.
export default function UnsavedChangesBar({
  changes,
  isSaving,
  onSave,
}: UnsavedChangesBarProps) {
  // The edits it was dismissed for: newer ones show it again.
  const [dismissedFor, setDismissedFor] = useState<object | null>(null);
  if (dismissedFor === changes) return null;

  return (
    <div
      role="status"
      className="sticky top-3 z-20 flex items-center gap-3 py-2 pl-4 pr-4 mb-6 rounded-extra-large bg-primary-container text-on-primary-container font-plain animate-enter-rise"
    >
      <Icon name="edit" className="w-5 h-5 shrink-0" />
      <span className="flex-1 min-w-0 text-body-medium">
        You have unsaved changes
      </span>
      <Button
        variant="filled"
        size="sm"
        loading={isSaving}
        onClick={onSave}
        className="shrink-0"
      >
        Save changes
      </Button>
      <Button
        variant="icon"
        color="gray"
        size="md"
        name="Dismiss"
        onClick={() => setDismissedFor(changes)}
        className="shrink-0 -mr-2 text-on-primary-container!"
      >
        <Icon name="close" className="w-6 h-6" />
      </Button>
    </div>
  );
}
