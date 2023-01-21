import { useEffect, useRef } from 'react';

import Button from './Button';
import OrDivider from './OrDivider';
import OutlinedInput from './inputs/OutlinedInput';
import StyledDialog from './StyledDialog';
import useSongForm from '../hooks/forms/useSongForm';
import { Link, useHistory } from 'react-router-dom';
import useCreateSong from '../hooks/api/useCreateSong';

export default function CreateSongDialog({ open, onCloseDialog }) {
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

  const inputRef = useRef();

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
      <div className="mb-4">
        <div className="mb-2">Name</div>
        <OutlinedInput
          placeholder="ex: Amazing Grace"
          value={name}
          onChange={newName => onChange('name', newName)}
          ref={inputRef}
        />
      </div>

      <Button
        full
        disabled={!isValid}
        loading={isCreating}
        onClick={handleCreate}
      >
        Create Song
      </Button>

      <OrDivider />

      <Link to="/import">
        <Button variant="open" full color="blue">
          Import a song
        </Button>
      </Link>
    </StyledDialog>
  );
}
