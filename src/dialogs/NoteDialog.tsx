import Button from '../components/Button';
import Label from '../components/Label';
import NoteColorOption from '../components/NoteColorOption';
import StyledDialog from '../components/StyledDialog';
import { useEffect } from 'react';
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
  const [updates, setUpdates] = useState<NoteUpdates>({});

  useEffect(() => {
    setUpdates({ content: note.content });
  }, [note]);

  function handleUpdate(field: keyof NoteUpdates, value: string) {
    setUpdates(currentUpdates => ({ ...currentUpdates, [field]: value }));
  }

  function handleConfirmUpdates() {
    onUpdate(updates);
    setUpdates({});
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
    setUpdates({});
    onDelete();
    onCloseDialog();
  }

  return (
    <StyledDialog
      open={open}
      onCloseDialog={onCloseDialog}
      borderedTop={false}
      title="Edit note"
    >
      <Label>Note</Label>
      <textarea
        placeholder="Type here"
        onChange={e => handleUpdate('content', e.target.value)}
        value={updates.content || ''}
        className="w-full p-2 mb-4 text-base transition-colors border rounded-md outline-hidden resize-none border-dark-gray-600 focus:outline-hidden focus:border-blue-400 dark:focus:border-dark-blue dark:bg-dark-gray-900 "
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
    </StyledDialog>
  );
}

const NOTE_COLOR_OPTIONS = {
  blue: 'bg-blue-200 dark:bg-blue-300',
  pink: 'bg-pink-200 dark:bg-pink-300',
  green: 'bg-green-200 bg-green-300',
  yellow: 'bg-yellow-200 bg-yellow-300',
};
