import { basename, extension } from '../utils/StringUtils';

import Button from '../components/Button';
import FilesApi from '../api/filesApi';
import OutlinedInput from '../components/inputs/OutlinedInput';
import StyledDialog from '../components/StyledDialog';
import { reportError } from '../utils/error';
import { useParams } from 'react-router';
import { useState } from 'react';
import type { SongFile } from '../types';

type EditSongFileDialogProps = {
  open: boolean;
  onCloseDialog: () => void;
  file: SongFile;
  onUpdated: (file: SongFile) => void;
};

export default function EditSongFileDialog({
  open,
  onCloseDialog,
  file,
  onUpdated,
}: EditSongFileDialogProps) {
  const [name, setName] = useState(basename(file.name));
  const [loading, setLoading] = useState(false);
  const [dirty, setDirty] = useState(false);
  const { id: songId } = useParams<{ id: string }>();

  function handleNameChange(updatedName: string) {
    setDirty(true);
    setName(updatedName);
  }

  async function handleSave() {
    try {
      setLoading(true);
      await FilesApi.updateSongFile(songId, file.id, { name });
      onUpdated({ ...file, name: `${name}.${extension(file.name)}` });
      handleClose();
    } catch (error) {
      reportError(error);
      setLoading(false);
    }
  }

  function handleClose() {
    setLoading(false);
    onCloseDialog();
  }

  return (
    <StyledDialog
      open={open}
      onCloseDialog={handleClose}
      title={file?.name}
      borderedTop={false}
    >
      <OutlinedInput
        value={name || ''}
        onChange={handleNameChange}
        className="mb-4"
        onEnter={handleSave}
        label="File name"
      />
      <Button full disabled={!dirty} onClick={handleSave} loading={loading}>
        Save changes
      </Button>
    </StyledDialog>
  );
}
