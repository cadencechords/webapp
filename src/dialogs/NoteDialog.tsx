import Button from '../components/Button';
import Label from '../components/Label';
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
    <StyledDialog
      open={open}
      onCloseDialog={onCloseDialog}
      borderedTop={false}
      title="Edit note"
    >
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
      <Label>Note</Label>
      <textarea
        placeholder="Type here"
        onChange={e => handleUpdate('content', e.target.value)}
        value={updates.content || ''}
        className="w-full px-4 py-3 mb-4 text-body-large text-on-surface placeholder:text-on-surface-variant caret-primary bg-transparent transition-fast-effects border rounded-extra-small outline-hidden resize-none border-outline hover:border-on-surface focus:outline-hidden focus:border-primary focus:shadow-[inset_0_0_0_1px_var(--color-primary)]"
      ></textarea>
      <Label>Note color</Label>
      <NoteColorOption
        color={NOTE_COLOR_OPTIONS.blue}
        selected={isSelectedColor('blue')}
        onClick={() => handleUpdate('color', 'blue')}
      />
      <NoteColorOption
        color={NOTE_COLOR_OPTIONS.pink}
        selected={isSelectedColor('pink')}
        onClick={() => handleUpdate('color', 'pink')}
      />
      <NoteColorOption
        color={NOTE_COLOR_OPTIONS.green}
        selected={isSelectedColor('green')}
        onClick={() => handleUpdate('color', 'green')}
      />
      <NoteColorOption
        color={NOTE_COLOR_OPTIONS.yellow}
        selected={isSelectedColor('yellow')}
        onClick={() => handleUpdate('color', 'yellow')}
      />
      <div className="items-center gap-4 mt-8 flex-between">
        <Button full onClick={handleConfirmUpdates}>
          Confirm
        </Button>
        <Button variant="icon" size="md" color="gray" onClick={handleDelete}>
          <Icon name="delete" className="w-5 h-5" />
        </Button>
      </div>
    </>
  );
}

const NOTE_COLOR_OPTIONS = {
  blue: 'bg-blue-200 dark:bg-blue-300',
  pink: 'bg-pink-200 dark:bg-pink-300',
  green: 'bg-green-200 bg-green-300',
  yellow: 'bg-yellow-200 bg-yellow-300',
};
