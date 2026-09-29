import Button from '../components/Button';
import DialogActions from '../components/DialogActions';
import NoteColorOption from '../components/NoteColorOption';
import StyledDialog from '../components/StyledDialog';
import { useState } from 'react';
import Icon from '../components/Icon';
import type { SongNote } from '../types';

/** The note fields this dialog edits. */
export type NoteUpdates = Partial<Pick<SongNote, 'content' | 'color'>>;

type NoteDialogProps = {
  note: Pick<SongNote, 'content' | 'color'>;
  open: boolean;
  onCloseDialog: () => void;
  onUpdate: (updates: NoteUpdates) => void;
  onDelete: () => void;
};

export default function NoteDialog({
  note,
  open,
  onCloseDialog,
  onUpdate,
  onDelete,
}: NoteDialogProps) {
  return (
    <StyledDialog open={open} onCloseDialog={onCloseDialog} title="Edit note">
      {/* StyledDialog unmounts its contents while closed, so each opening
          starts from the note as it is now. */}
      <NoteForm
        note={note}
        onCloseDialog={onCloseDialog}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    </StyledDialog>
  );
}

function NoteForm({
  note,
  onCloseDialog,
  onUpdate,
  onDelete,
}: Omit<NoteDialogProps, 'open'>) {
  const [updates, setUpdates] = useState<NoteUpdates>(() => ({
    content: note.content,
  }));

  function handleUpdate(field: keyof NoteUpdates, value: string) {
    setUpdates(currentUpdates => ({ ...currentUpdates, [field]: value }));
  }

  function handleConfirmUpdates() {
    onUpdate(updates);
    onCloseDialog();
  }

  function isSelectedColor(color: string) {
    if (updates.color) {
      return updates.color === color;
    } else {
      return note.color === color;
    }
  }

  function handleDelete() {
    onDelete();
    onCloseDialog();
  }

  return (
    <>
      <textarea
        aria-label="Note"
        placeholder="Type here"
        rows={3}
        onChange={e => handleUpdate('content', e.target.value)}
        value={updates.content || ''}
        className="w-full px-4 py-3 mb-6 text-body-large text-on-surface placeholder:text-on-surface-variant caret-primary bg-transparent transition-fast-effects border rounded-extra-small outline-hidden resize-none border-outline hover:border-on-surface focus:outline-hidden focus:border-primary focus:shadow-[inset_0_0_0_1px_var(--color-primary)]"
      ></textarea>
      <div className="mb-3 font-plain text-title-small text-on-surface-variant">
        Color
      </div>
      <div role="radiogroup" aria-label="Color" className="flex gap-3">
        {NOTE_COLORS.map(color => (
          <NoteColorOption
            key={color}
            color={color}
            selected={isSelectedColor(color)}
            onClick={() => handleUpdate('color', color)}
          />
        ))}
      </div>
      {/* Delete at the start, apart from Cancel and Save at the end. */}
      <DialogActions
        onCancel={onCloseDialog}
        start={
          <Button
            variant="open"
            color="red"
            size="sm"
            onClick={handleDelete}
            className="flex-center gap-2 mr-auto"
          >
            <Icon name="delete" className="w-5 h-5" />
            Delete
          </Button>
        }
        primary={
          <Button size="sm" onClick={handleConfirmUpdates}>
            Save
          </Button>
        }
      />
    </>
  );
}

const NOTE_COLORS = ['blue', 'pink', 'green', 'yellow'];
