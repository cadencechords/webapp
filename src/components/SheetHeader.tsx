import Button from './Button';

type SheetHeaderProps = {
  title: string;
  /** Shows Save changes, for unsaved edits the member may save. */
  onSave?: () => void;
  saving?: boolean;
};

// A bottom sheet's headline in title-large, with Save changes (a small tonal
// button) at its end while there's something to save. Room is left on the
// right for the sheet's close button.
export default function SheetHeader({
  title,
  onSave,
  saving,
}: SheetHeaderProps) {
  return (
    <div className="flex items-center gap-3 mb-6 min-h-12 pr-12">
      <h2 className="flex-1 min-w-0 truncate font-plain text-title-large text-on-surface">
        {title}
      </h2>
      {onSave && (
        <Button variant="accent" size="sm" onClick={onSave} loading={saving}>
          Save changes
        </Button>
      )}
    </div>
  );
}
