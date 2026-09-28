import Button from './Button';
import Icon from './Icon';

type UnsavedChangesBarProps = {
  isSaving: boolean;
  onSave: () => void;
};

// A detail page's pending edits, above its title: a tonal banner on
// primary-container saying there are unsaved changes, with a filled Save
// button at its end. It's the page's only save control, so it can't be
// dismissed, and it sticks to the top while the page scrolls, so it stays in
// view while editing fields further down.
export default function UnsavedChangesBar({
  isSaving,
  onSave,
}: UnsavedChangesBarProps) {
  return (
    <div
      role="status"
      className="sticky top-3 z-10 flex items-center gap-3 py-2 pl-4 pr-4 mb-3 rounded-extra-large bg-primary-container text-on-primary-container font-plain animate-enter-rise"
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
    </div>
  );
}
