import { useState } from 'react';
import Button from './Button';
import Icon from './Icon';

type UnsavedChangesBarProps = {
  /** The pending edits: a new object with each edit, which brings a
      dismissed bar back. */
  changes: object;
  isSaving: boolean;
  onSave: () => void;
};

// A detail page's pending edits, above its title: a tonal banner on
// primary-container saying there are unsaved changes, with a filled Save
// button and a dismiss button at its end. Dismissing only hides the bar (the
// edits stay) until the next edit.
export default function UnsavedChangesBar({
  changes,
  isSaving,
  onSave,
}: UnsavedChangesBarProps) {
  const [dismissedChanges, setDismissedChanges] = useState<object | null>(null);
  if (dismissedChanges === changes) return null;

  return (
    <div
      role="status"
      className="flex items-center gap-3 py-2 pl-4 pr-2 mb-3 rounded-extra-large bg-primary-container text-on-primary-container font-plain animate-enter-rise"
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
      <button
        type="button"
        aria-label="Dismiss"
        onClick={() => setDismissedChanges(changes)}
        // M3 standard icon button, in the banner's content color.
        className="flex-center shrink-0 w-10 h-10 rounded-[20px] [--shape-morph-to:8px] state-layer-flat focus-ring shape-morph"
      >
        <Icon name="close" className="w-5 h-5" />
      </button>
    </div>
  );
}
