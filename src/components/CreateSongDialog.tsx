import { useEffect, useRef } from 'react';

import Button, { buttonClasses } from './Button';
import DialogActions from './DialogActions';
import OutlinedInput from './inputs/OutlinedInput';
import StyledDialog from './StyledDialog';
import useSongForm from '../hooks/forms/useSongForm';
import { Link, useHistory } from 'react-router-dom';
import useCreateSong from '../hooks/api/useCreateSong';

type CreateSongDialogProps = {
  open: boolean;
  onCloseDialog: () => void;
};

export default function CreateSongDialog({
  open,
  onCloseDialog,
}: CreateSongDialogProps) {
  const { form, onChange, isValid, clearForm } = useSongForm();
  const { name } = form;
  const router = useHistory();

  const { isLoading: isCreating, run: createSong } = useCreateSong({
    onSuccess: createdSong => {
      clearForm();
      onCloseDialog();
      router.push(`/songs/${createdSong.id}`);
    },
  });

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setTimeout(() => {
      if (open) {
        inputRef.current?.focus();
      }
    }, 100);
  }, [open]);

  function handleCreate() {
    createSong(form);
  }

  return (
    <StyledDialog
      title="Create a new song"
      open={open}
      onCloseDialog={onCloseDialog}
      size="lg"
      fullscreen={true}
    >
      <OutlinedInput
        label="Name"
        value={name}
        onChange={newName => onChange('name', newName)}
        ref={inputRef}
      />

      {/* Importing instead sits at the start, apart from Cancel and Create. */}
      <DialogActions
        onCancel={onCloseDialog}
        start={
          <Link
            to="/import"
            className={buttonClasses({
              variant: 'open',
              size: 'sm',
              className: 'flex-center mr-auto',
            })}
          >
            Import a song
          </Link>
        }
        primary={
          <Button
            variant="open"
            size="sm"
            disabled={!isValid}
            loading={isCreating}
            onClick={handleCreate}
          >
            Create
          </Button>
        }
      />
    </StyledDialog>
  );
}
